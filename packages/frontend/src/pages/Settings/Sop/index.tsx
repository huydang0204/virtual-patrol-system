import React, {
  memo,
  useEffect,
  useState
} from "react";
import { Button } from "reactstrap";
import { RxTrash } from "react-icons/rx";
import { AiOutlineEye } from "react-icons/ai";

import Table from "components/Table";
import CreateSopSettings from "./SopSettingsCreate";
import SopSettingsDetail from "./SopSettingsDetail";

import { SopResponse } from "@vps/utils/lib/dto";
import {
  HeaderTab,
  TableColumn,
  TableHeader
} from "model-type/component-style";

import {
  deleteSop,
  fetchSops
} from "services/sop";
import { renderCommonCell } from "utils/table";
import { SopType } from "@vps/utils/lib/data";
import {
  CommonSettingsProps,
  NO_RECORDS
} from "../types";

interface SopSettingsProps extends CommonSettingsProps {
  sopCounts : Record<SopType, number>
}

function SopSettings(props : SopSettingsProps) : JSX.Element {
  const {
    onOpenNotifyModal,
    onOpenConfirmationModal,
    onReloadCountData,
    sopCounts,
    searchText,
    onSearchChange
  } = props;
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    sops,
    setSops
  ] = useState<SopResponse[]>([]);
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
    selectedSop,
    setSelectedSop
  ] = useState<SopResponse>(null);
  const [
    selectedSopType,
    setSelectedSopType
  ] = useState<SopType>(SopType.General);

  const loadSops = async (type : SopType, page : number, searchText? : string) : Promise<void> => {
    setLoading(true);

    const offset = (page - 1) * NO_RECORDS;
    const {
      data,
      count
    } = await fetchSops(type, searchText, NO_RECORDS, offset);
    if (!!data) {
      setSops(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    loadSops(selectedSopType, page, searchText);
  };

  const onSuccessCreation = () : void => {
    setCreateMode(false);
    onOpenNotifyModal && onOpenNotifyModal("Create SOP", "SOP has been created!");
    loadSops(selectedSopType, currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onSuccessEdit = () : void => {
    setSelectedSop(null);
    onOpenNotifyModal && onOpenNotifyModal("Edit SOP", "SOP has been updated!");
    loadSops(selectedSopType, currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onConfirmDeletion = async (id : number) : Promise<void> => {
    setLoading(true);
    const {
      data,
      errors
    } = await deleteSop(id);
    if (!!data && !errors) {
      onOpenNotifyModal && onOpenNotifyModal("Delete SOP", "SOP has been deleted!");
      loadSops(selectedSopType, currentPage, searchText);
      onReloadCountData && onReloadCountData();
    }
    setLoading(false);
  };

  const openDeleteConfirmationModal = (sop : SopResponse) : void => {
    onOpenConfirmationModal &&
    onOpenConfirmationModal(
      "Delete SOP",
      `SOP will be detached from existing cameras. Are you sure you want to delete ${ sop.name }?`,
      () => onConfirmDeletion(sop.id)
    );
  };

  const onSearch = (searchValue : string) : void => {
    setCurrentPage(1);
    loadSops(selectedSopType, 1, searchValue);
    onSearchChange && onSearchChange(searchValue);
  };

  const onTabChange = (tab : SopType) : void => {
    setCurrentPage(1);
    setSelectedSopType(tab);
    onSearchChange && onSearchChange(null);
    loadSops(tab, 1);
  };

  useEffect(() => {
    loadSops(SopType.General, 1);
  }, []);

  const tableColumns : TableColumn[] = [
    {
      label : "SOP Name",
      path : "name"
    }
  ];
  if (selectedSopType === SopType.Special) {
    tableColumns.push({
      label : "Start Date",
      path : "startDate"
    }, {
      label : "End Date",
      path : "endDate"
    });
  }
  tableColumns.push(
    {
      label : "SOP Checklists",
      content : (row : SopResponse) => (
        <div className="text-success">{ row?.checklists[0] + (row?.checklists.length > 1 ? ( ", +" + (row?.checklists.length - 1)) : "") }</div>
      )
    },
    {
      label : "Date Created",
      path : "createdAt"
    },
    {
      label : "Action",
      content : (row : SopResponse) => (
        <div className="cursor-pointer d-flex align-items-center justify-content-center gap-1">
          <div
            data-test={`table__view-details-${row.id}`}
            style={ { width : "20px" } }
            onClick={ () : void => setSelectedSop(row) }>
            <AiOutlineEye size={ 15 } />
          </div>
          <div
            data-test={`table__delete-btn-${row.id}`}
            style={ { width : "20px" } }
            onClick={ () : void => openDeleteConfirmationModal(row) }>
            <RxTrash size={ 16 } />
          </div>
        </div>
      )
    }
  );

  const tableHeader : TableHeader = { columns : tableColumns };
  const tableBody = {
    columns : tableColumns,
    rows : sops,
    renderCell : renderCommonCell
  };
  const tableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit : NO_RECORDS,
    handlePageChange,
    pageLimitControl : null
  };

  const listMode = !createMode && !selectedSop;
  const selectionTabs : HeaderTab<SopType>[] = [
    {
      name : "General SOP",
      value : SopType.General,
      count : !sopCounts ? 0 : sopCounts[SopType.General]
    },
    {
      name : "Special SOP",
      value : SopType.Special,
      count : !sopCounts ? 0 : sopCounts[SopType.Special]
    }
  ];

  return (
    <div>
      { listMode && (
        <div data-test="sop-list__table">
          <Table
            Actions={
              <Button
                data-test="btn-create"
                color="primary"
                className="rounded-3"
                onClick={ () : void => {
                  setCreateMode(true);
                } }>
                Create SOP
              </Button>
            }
            actionBar={ {
              search : {
                value : searchText,
                placeholder : "Search by SOP name",
                handleSearch : onSearch
              }
            } }
            isLoading={ loading }
            reloadData={ () : void => {
              loadSops(selectedSopType, currentPage, searchText);
            } }
            header={ tableHeader }
            body={ tableBody }
            footer={ tableFooter }
            selectionTabs={ selectionTabs }
            selectedTab={ selectedSopType }
            onTabSelection={ onTabChange } />
        </div>
      ) }
      { createMode && (
        <CreateSopSettings
          defaultType={ selectedSopType }
          onClose={ () : void => setCreateMode(false) }
          onSuccess={ onSuccessCreation } />
      ) }
      { selectedSop && (
        <SopSettingsDetail
          sop={ selectedSop }
          onClose={ () : void => setSelectedSop(null) }
          onSuccess={ onSuccessEdit }
        />
      ) }
    </div>
  );
}

export default memo(SopSettings);
