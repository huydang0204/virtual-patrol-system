import React, {
  memo,
  useEffect,
  useState
} from "react";
import { Button } from "reactstrap";
import {
  RxPencil2,
  RxTrash
} from "react-icons/rx";

import Table from "components/Table";
import CreateSiteSettings from "./SiteSettingsCreate";
import SiteSettingsDetail from "./SiteSettingsDetail";

import { SiteResponse } from "@vps/utils/lib/dto";
import { TableHeader } from "model-type/component-style";

import {
  deleteSite,
  fetchSites
} from "services/site";
import { renderCommonCell } from "utils/table";
import { CommonSettingsProps } from "../types";
import { PAGE_LIMIT } from "data/common-data";

function SiteSettings(props : CommonSettingsProps) : JSX.Element {
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
    sites,
    setSites
  ] = useState<SiteResponse[]>([]);
  const [
    totalCount,
    setTotalCount
  ] = useState<number>(0);
  const [
    limit,
    setLimit
  ] = useState<PAGE_LIMIT>(10);
  const [
    currentPage,
    setCurrentPage
  ] = useState<number>(1);
  const [
    createMode,
    setCreateMode
  ] = useState<boolean>(false);
  const [
    selectedSite,
    setSelectedSite
  ] = useState<SiteResponse>(null);

  const loadSites = async (limit : number, page : number, searchText? : string) : Promise<void> => {
    setLoading(true);

    const offset = (page - 1) * limit;
    const {
      data : sites,
      count
    } = await fetchSites(searchText, limit, offset);
    if (!!sites) {
      setSites(sites);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handlePageLimitChange = (value : PAGE_LIMIT) : void => {
    setCurrentPage(1);
    setLimit(value);
    loadSites(value, 1, searchText);
  };

  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    loadSites(limit, page, searchText);
  };

  const onSuccessCreation = () : void => {
    setCreateMode(false);
    onOpenNotifyModal && onOpenNotifyModal("Create Site", "Site has been created!");
    loadSites(limit, currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onSuccessEdit = () : void => {
    setSelectedSite(null);
    onOpenNotifyModal && onOpenNotifyModal("Edit Site", "Site has been updated!");
    loadSites(limit, currentPage);
    onReloadCountData && onReloadCountData();
  };

  const onConfirmDeletion = async (site : SiteResponse) : Promise<void> => {
    setLoading(true);
    const {
      data,
      errors
    } = await deleteSite(site);
    if (!!data && !errors) {
      onOpenNotifyModal && onOpenNotifyModal("Delete Site", "Site has been deleted!");
      loadSites(limit, currentPage, searchText);
      onReloadCountData && onReloadCountData();
    } else {
      if (errors) {
        onOpenNotifyModal &&
        onOpenNotifyModal(
          "Delete Site Failed",
          "Failed to delete site due to internal errors!",
          true
        );
      }
    }
    setLoading(false);
  };

  const openDeleteConfirmationModal = (site : SiteResponse) : void => {
    onOpenConfirmationModal &&
    onOpenConfirmationModal(
      "Delete Site",
      `Are you sure you want to delete ${ site.name }?\n
               Site will be detached from existing cameras, and all of site's patrol route will be deleted.`,
      () => onConfirmDeletion(site)
    );
  };

  const onSearch = (searchValue : string) : void => {
    setCurrentPage(1);
    onSearchChange && onSearchChange(searchValue);
    loadSites(limit, 1, searchValue);
  };

  useEffect(() => {
    loadSites(10, 1);
  }, []);

  const tableColumns = [
    {
      label : "Site No.",
      path : "id"
    },
    {
      label : "Site Name",
      path : "name"
    },
    {
      label : "Description",
      path : "description"
    },
    {
      label : "No. of cameras",
      path : "noCameras"
    },
    {
      label : "Action",
      content : (row : SiteResponse) => (
        <div className="cursor-pointer d-flex align-items-center justify-content-center gap-1">
          <div
            data-test={`table__edit-btn-${row.id}`}
            style={ { width : "20px" } }
            onClick={ () : void => setSelectedSite(row) }>
            <RxPencil2 size={ 15 } />
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
    rows : sites,
    renderCell : renderCommonCell
  };
  const tableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit,
    handlePageChange,
    pageLimitControl : { handlePageLimitChange }
  };

  const listMode = !createMode && !selectedSite;

  return (
    <div>
      { listMode && (
        <div data-test="site-list__table">
          <Table
            Actions={
              <Button
                data-test="btn-create-site"
                color="primary"
                className="rounded-3"
                onClick={ () : void => {
                  setCreateMode(true);
                } }>
                Create Site
              </Button>
            }
            actionBar={ {
              search : {
                value : searchText,
                placeholder : "Search by Site name",
                handleSearch : onSearch
              }
            } }
            isLoading={ loading }
            reloadData={ () : void => {
              loadSites(limit, currentPage, searchText);
            } }
            header={ tableHeader }
            body={ tableBody }
            footer={ tableFooter }
          />
        </div>
      ) }
      { createMode && (
        <CreateSiteSettings
          onClose={ () : void => setCreateMode(false) }
          onSuccess={ onSuccessCreation } />
      ) }
      { selectedSite && (
        <SiteSettingsDetail
          siteId={ selectedSite.id }
          onClose={ () : void => setSelectedSite(null) }
          onSuccess={ onSuccessEdit }
        />
      ) }
    </div>
  );
}

export default memo(SiteSettings);
