import React, {
  memo,
  useEffect,
  useState
} from "react";
import { AiOutlineEye } from "react-icons/ai";

import Table from "components/Table";

import CameraSettingsDetail from "./CameraSettingsDetail";
import SOPLabel from "./SOPLabel";

import { PAGE_LIMIT } from "data/common-data";
import {
  CameraResponse,
  SopResponse
} from "@vps/utils/lib/dto";
import {
  TableBody,
  TableFooter,
  TableHeader
} from "model-type/component-style";

import { renderCommonCell } from "utils/table";
import { fetchCameras } from "services/camera";

import { CommonSettingsProps } from "../types";

const MAX_SOP_DISPLAYED = 3;

function CameraSettings(props : CommonSettingsProps) : JSX.Element {
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
    cameras,
    setCameras
  ] = useState<CameraResponse[]>([]);
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
    selectedCamera,
    setSelectedCamera
  ] = useState<CameraResponse>(null);

  const loadCameras = async (limit : number, page : number, searchText? : string) : Promise<void> => {
    setLoading(true);

    const offset = (page - 1) * limit;
    const {
      data : cameras,
      count
    } = await fetchCameras(null, searchText, limit, offset);
    if (!!cameras) {
      setCameras(cameras);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handlePageLimitChange = (value : PAGE_LIMIT) : void => {
    setCurrentPage(1);
    setLimit(value);
    loadCameras(value, 1, searchText);
  };

  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    loadCameras(limit, page, searchText);
  };

  const onSuccessEdit = () : void => {
    setSelectedCamera(null);
    onOpenNotifyModal && onOpenNotifyModal("Edit Camera", "Camera has been updated!");
    loadCameras(limit, currentPage, searchText);
    onReloadCountData && onReloadCountData();
  };

  const onSearch = (searchValue : string) : void => {
    setCurrentPage(1);
    onSearchChange && onSearchChange(searchValue);
    loadCameras(limit, 1, searchValue);
  };

  useEffect(() => {
    loadCameras(10, 1);
  }, []);

  const tableColumns = [
    {
      label : "Camera",
      path : "name"
    },
    {
      label : "ID",
      path : "id"
    },
    {
      label : "Site",
      path : "siteName"
    },
    {
      label : "SOP",
      content : (row : CameraResponse) => (
        <div className="d-flex align-items-center gap-1">
          {
            !!row.sops && row.sops.length > 0 &&
            row.sops.slice(0, MAX_SOP_DISPLAYED).map((sop : SopResponse) => (
              <SOPLabel
                key={ sop.id }
                sop={ sop.name }
              />
            ))
          }
          { !!row.sops && row.sops.length > MAX_SOP_DISPLAYED && <div className="text-muted">...</div> }
        </div>
      )
    },
    {
      label : "Action",
      content : (row : CameraResponse) => (
        <div data-test={`table__view-details-${row.id}`} className="d-flex justify-content-center">
          <AiOutlineEye
            className="cursor-pointer"
            onClick={ () : void => setSelectedCamera(row) }
            size={ 15 } />
        </div>
      )
    }
  ];
  const tableHeader : TableHeader = { columns : tableColumns };
  const tableBody : TableBody<CameraResponse> = {
    columns : tableColumns,
    rows : cameras,
    renderCell : renderCommonCell
  };
  const tableFooter : TableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit,
    handlePageChange,
    pageLimitControl : { handlePageLimitChange }
  };

  const listMode = !selectedCamera;

  return (
    <div>
      { listMode && (
        <div data-test="cameras-list__table">
          <Table
            actionBar={ {
              search : {
                value : searchText,
                placeholder : "Search by Camera name, Site or SOP",
                handleSearch : onSearch
              }
            } }
            isLoading={ loading }
            reloadData={ () : void => {
              loadCameras(limit, currentPage, searchText);
            } }
            header={ tableHeader }
            body={ tableBody }
            footer={ tableFooter }
          />
        </div>
      ) }
      {
        !!selectedCamera &&
        <CameraSettingsDetail
          camera={ selectedCamera }
          onClose={ () : void => setSelectedCamera(null) }
          onSuccess={ onSuccessEdit }
        />
      }
    </div>
  );
}

export default memo(CameraSettings);
