import React, {
  memo,
  useEffect,
  useState
} from "react";
import { Button } from "reactstrap";
import { RxTrash } from "react-icons/rx";
import { AiOutlineEye } from "react-icons/ai";

import Table from "components/Table";
import CreateAlertTypeSettings from "./AlertTypeSettingsCreate";
import AlertTypeSettingsDetail from "./AlertTypeSettingsDetail";

import { AlertTypeResponse } from "@vps/utils/lib/dto";
import {
  TableColumn,
  TableHeader
} from "model-type/component-style";

import { renderCommonCell } from "utils/table";
import {
  deleteAlertType,
  fetchAlertTypes
} from "services/alert-types";
import {
  CommonSettingsProps,
  NO_RECORDS
} from "../types";

function AlertTypeSettings(props : CommonSettingsProps) : JSX.Element {
  const {
    onOpenNotifyModal,
    onOpenConfirmationModal,
    onReloadCountData,
    searchText,
    onSearchChange
  } = props;
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    alertTypes,
    setAlertTypes
  ] = useState<AlertTypeResponse[]>([]);
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
    selectedAlertType,
    setSelectedAlertType
  ] = useState<AlertTypeResponse>(null);

  const loadAlertTypes = async (page : number, searchText? : string) : Promise<void> => {
    setLoading(true);

    const offset = (page - 1) * NO_RECORDS;
    const {
      data,
      count
    } = await fetchAlertTypes(searchText, NO_RECORDS, offset);
    if (!!data) {
      setAlertTypes(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    loadAlertTypes(page, searchText);
  };

  const onSuccessCreation = () : void => {
    setCreateMode(false);
    onOpenNotifyModal && onOpenNotifyModal("Create Alert Type", "Alert Type has been created!");
    loadAlertTypes(currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onSuccessEdit = () : void => {
    setSelectedAlertType(null);
    onOpenNotifyModal && onOpenNotifyModal("Edit Alert Type", "Alert Type has been updated!");
    loadAlertTypes(currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onConfirmDeletion = async (id : string) : Promise<void> => {
    setLoading(true);
    const {
      data,
      errors
    } = await deleteAlertType(id);
    if (!!data && !errors) {
      onOpenNotifyModal && onOpenNotifyModal("Delete Alert Type", "Alert Type has been deleted!");
      loadAlertTypes(currentPage, searchText);
      onReloadCountData && onReloadCountData();
    }
    setLoading(false);
  };

  const openDeleteConfirmationModal = (type : AlertTypeResponse) : void => {
    onOpenConfirmationModal &&
    onOpenConfirmationModal(
      "Delete Alert Type",
      `Are you sure you want to delete ${ type.type }?`,
      () => onConfirmDeletion(type.id)
    );
  };

  const onSearch = (searchValue : string) : void => {
    setCurrentPage(1);
    onSearchChange && onSearchChange(searchValue);
    loadAlertTypes(1, searchValue);
  };

  useEffect(() => {
    loadAlertTypes(1);
  }, []);

  const tableColumns : TableColumn[] = [
    {
      label : "Alert Type",
      path : "type"
    },
    {
      label : "Description",
      content : (row : AlertTypeResponse) => (
        <div className="text-truncate">{ row?.description }</div>
      )
    },
    {
      label : "Action Taken",
      content : (row : AlertTypeResponse) => (
        <div className="text-success text-truncate">{ row?.actionTaken[0] + (row?.actionTaken.length > 1 ? ",..." : "") }</div>
      )
    },
    {
      label : "Action",
      content : (row : AlertTypeResponse) => (
        <div className="cursor-pointer d-flex align-items-center justify-content-center gap-1">
          <div
            data-test={`table__view-details-${row.id}`}
            style={ { width : "20px" } }
            onClick={ () : void => setSelectedAlertType(row) }>
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
  ];

  const tableHeader : TableHeader = { columns : tableColumns };
  const tableBody = {
    columns : tableColumns,
    rows : alertTypes,
    renderCell : renderCommonCell
  };
  const tableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit : NO_RECORDS,
    handlePageChange,
    pageLimitControl : null
  };

  const listMode = !createMode && !selectedAlertType;

  return (
    <div>
      { listMode && (
        <div data-test="alert-type-list__table">
          <Table
            Actions={
              <Button
                color="primary"
                className="rounded-3"
                onClick={ () : void => {
                  setCreateMode(true);
                } }>
                Create Alert Type
              </Button>
            }
            actionBar={ {
              search : {
                value : searchText,
                placeholder : "Search by type",
                handleSearch : onSearch
              }
            } }
            isLoading={ loading }
            reloadData={ () : void => {
              loadAlertTypes(currentPage, searchText);
            } }
            header={ tableHeader }
            body={ tableBody }
            footer={ tableFooter } />
        </div>
      ) }
      { createMode && (
        <CreateAlertTypeSettings
          onClose={ () : void => setCreateMode(false) }
          onSuccess={ onSuccessCreation } />
      ) }
      { selectedAlertType && (
        <AlertTypeSettingsDetail
          alertType={ selectedAlertType }
          onClose={ () : void => setSelectedAlertType(null) }
          onSuccess={ onSuccessEdit }
        />
      ) }
    </div>
  );
}

export default memo(AlertTypeSettings);
