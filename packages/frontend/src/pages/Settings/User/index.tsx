import React, {
  memo,
  useEffect,
  useState
} from "react";
import { Button } from "reactstrap";
import {
  AiOutlineEye,
  AiOutlineUser
} from "react-icons/ai";

import Table from "components/Table";
import Badge from "components/Badge";
import RecentLogins from "./RecentLogins";
import RecentActivities from "./RecentActivities";
import UserDetails from "./UserDetails";
import UserCreate from "./UserCreate";

import {
  TableColumn,
  TableHeader
} from "model-type/component-style";
import {
  CommonSettingsProps,
  NO_RECORDS
} from "../types";
import { fetchUsers } from "services/user";
import { renderCommonCell } from "utils/table";
import { getFormattedDate } from "utils/time-format";
import { UserResponse } from "@vps/utils/lib/dto";
import { UserStatus } from "@vps/utils/lib/data";

function UserSettings(props : CommonSettingsProps) : JSX.Element {
  const {
    onOpenNotifyModal,
    onReloadCountData,
    searchText,
    onSearchChange
  } = props;
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    users,
    setUsers
  ] = useState<UserResponse[]>([]);
  const [
    totalCount,
    setTotalCount
  ] = useState<number>(0);
  const [
    currentPage,
    setCurrentPage
  ] = useState(1);
  const [
    createMode,
    setCreateMode
  ] = useState<boolean>(false);
  const [
    selectedUser,
    setSelectedUser
  ] = useState<UserResponse>(null);
  const [viewportHeight,
    setViewportHeight] = useState(window.innerHeight);

  const loadUsers = async (page : number, searchText? : string) : Promise<void> => {
    setLoading(true);

    const offset = (page - 1) * NO_RECORDS;
    const {
      data,
      count
    } = await fetchUsers(["All"], searchText, NO_RECORDS, offset, true);
    if (!!data) {
      setUsers(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    loadUsers(page, searchText);
  };

  const onSuccessCreation = () : void => {
    setCreateMode(false);
    onOpenNotifyModal && onOpenNotifyModal("Create User", "User has been created!");
    loadUsers(currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onSuccessEdit = () : void => {
    setSelectedUser(null);
    onOpenNotifyModal && onOpenNotifyModal("Edit User", "User has been updated!");
    loadUsers(currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onSearch = (searchValue : string) : void => {
    setCurrentPage(1);
    loadUsers(1, searchValue);
    onSearchChange && onSearchChange(searchValue);
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  const tableColumns : TableColumn[] = [
    {
      label : "Username",
      content : (row : UserResponse) => (
        <div className="d-flex gap-1 align-items-center">
          { row?.avatar ? <img
            src={ row?.avatar }
            className="avatar-in-table" /> :
            <div className="border border-gray p-1 rounded-pill no-avatar"><AiOutlineUser size={ 15 } /></div> }
          { row?.name }
        </div>
      )
    },
    {
      label : "Last Active",
      content : (row : UserResponse) => (
        // TODO: to check latestLogin when available
        <div className="text-truncate">{ row?.latestLogin ? getFormattedDate(new Date(row?.latestLogin), true) : "—" }</div>
      )
    },
    {
      label : "Role",
      path : "role"
    },
    {
      label : "Status",
      content : (row : UserResponse) => (
        (UserStatus.active === row?.status && <Badge
          text={ row?.status }
          variant="success" />) ||
        (UserStatus.blocked === row?.status && <Badge
          text={ row?.status }
          variant="danger" />) ||
        (UserStatus.inactive === row?.status && <Badge
          text={ row?.status }
          variant="secondary" />)
      )
    },
    {
      label : "Action",
      content : (row : UserResponse) => (
        <div className="cursor-pointer d-flex align-items-center justify-content-center gap-1">
          <div
            data-test={`table__view-details-${row.id}`}
            style={ { width : "20px" } }
            onClick={ () : void => setSelectedUser(row) }>
            <AiOutlineEye size={ 15 } />
          </div>
        </div>
      )
    }
  ];

  const tableHeader : TableHeader = { columns : tableColumns };
  const tableBody = {
    columns : tableColumns,
    rows : users,
    renderCell : renderCommonCell
  };
  const tableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit : NO_RECORDS,
    handlePageChange,
    pageLimitControl : null
  };

  const listMode = !createMode && !selectedUser;

  useEffect(() => {
    const handleResize = () : void => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      { listMode && (
        <div className="d-flex row g-3">
          <div data-test="users-list__table" className="col-12 col-lg-8">
            <Table
              Actions={
                <Button
                  data-test="btn-create"
                  color="primary"
                  className="rounded-3"
                  onClick={ () : void => {
                    setCreateMode(true);
                  } }>
                  Create User
                </Button>
              }
              actionBar={ {
                search : {
                  value : searchText,
                  placeholder : "Search by User name or email",
                  handleSearch : onSearch
                }
              } }
              isLoading={ loading }
              reloadData={ () : void => {
                loadUsers(currentPage, searchText);
              } }
              header={ tableHeader }
              body={ tableBody }
              footer={ tableFooter } />
          </div>
          <div className="col-12 col-lg-4">
            <div className="row gap-3">
              <div className="col-12">
                <RecentLogins height={ (Math.floor((2 / 3) * viewportHeight)) / 2 } />
              </div>
              <div className="col-12">
                <RecentActivities height={ (Math.floor((2 / 3) * viewportHeight)) / 2 } />
              </div>
            </div>
          </div>
        </div>
      ) }
      { selectedUser && (
        <UserDetails
          user={ selectedUser }
          onClose={ () : void => {
            setSelectedUser(null);
            loadUsers(currentPage, searchText);
          } }
          onSuccess={ onSuccessEdit }
        />
      ) }
      { createMode && <UserCreate
        onClose={ () : void => setCreateMode(false) }
        onSuccess={ onSuccessCreation } /> }
    </div>
  );
}

export default memo(UserSettings);
