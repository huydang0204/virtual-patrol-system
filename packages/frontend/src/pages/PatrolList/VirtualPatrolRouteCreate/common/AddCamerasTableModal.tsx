import _ from "lodash";
import React, {
  ChangeEvent,
  useEffect, useState
} from "react";
import {
  Button, Modal, ModalBody
} from "reactstrap";

import Table from "components/Table";

import {
  TableBody, TableColumn, TableDisplayingFilterType, TableHeader, TableTheme
} from "model-type/component-style";
import { fetchCameras } from "services/camera";
import { search } from "utils/search";
import { paginate } from "utils/pagination";
import { TableSelectAllBehavior } from "data/common-data";
import { SiteResponse } from "@vps/utils/src/dto/site";
import { CameraResponse } from "@vps/utils/lib/dto";

interface ComponentProps {
  isOpen: boolean;
  isSelectAllEnabled ?: boolean;
  isMaxCheckableCountReached: boolean;
  selectAllBehavior ?: TableSelectAllBehavior;
  submitButtonLabel ?: string;
  selectedSite: SiteResponse;
  checkedCameras: CameraResponse[];
  footerMessage?: JSX.Element | "";
  onRowCheck: (row: CameraResponse, currentPage ?: number, paginatedList ?: CameraResponse[]) => void;
  onModalClose : (order : number | undefined, command : string) => void;
  onCamerasAdd : () => void,
  onAllRowsCheck ?: (items : CameraResponse[]) => void,
  onAllRowsInCurrentPageCheck ?: (params : {
    currentPage: number,
    items: CameraResponse[],
    status: "select" | "clear",
  }) => void;
}

const AddCamerasTableModal: React.FC<ComponentProps> = ({
  isOpen,
  submitButtonLabel = "Add",
  isSelectAllEnabled = false,
  selectedSite,
  isMaxCheckableCountReached,
  selectAllBehavior,
  checkedCameras,
  footerMessage = "",
  onRowCheck,
  onModalClose,
  onCamerasAdd,
  onAllRowsCheck,
  onAllRowsInCurrentPageCheck
} : ComponentProps): JSX.Element => {
  const [cameras,
    setCameras] = useState<CameraResponse[]>([]);
  const [allCameras,
    setAllCameras] = useState<CameraResponse[]>([]);
  const [pageSize,
    setPageSize] = useState<number>(10);
  const [currentPage,
    setCurrentPage] = useState<number>(1);
  const [displayingFilterType,
    setDisplayingFilterType] = useState<TableDisplayingFilterType>(TableDisplayingFilterType.All);
  const [isLoading,
    setIsLoading] = useState(true);
  const [isCurrentPageAllSelected,
    setIsCurrentPageAllSelected] = useState(false);

  const getCamerasBySite = async (siteId : string): Promise<void> => {
    const { data } = await fetchCameras(siteId);
    setCameras(data);
    setAllCameras(data);
  };

  const getAllCameras = async () : Promise<void> => {
    const { data } = await fetchCameras();
    setCameras(data);
    setAllCameras(data);
  };

  const paginatedList = paginate(cameras, currentPage, pageSize);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    handleDisplayingFilterStates(displayingFilterType);
  };

  const handlePageSizeChange = (pageSize: number): void => {
    setPageSize(pageSize);
    setCurrentPage(1);

    // on pagesize change, unselect global check, rows-checks remains as it before
    if (!!selectAllBehavior && selectAllBehavior === TableSelectAllBehavior.CURRENT_PAGE) {
      const _items = _.filter(paginate(cameras, currentPage, pageSize), (item : CameraResponse) =>
        _.some(checkedCameras, (checkedItem : CameraResponse) => checkedItem.id === item.id));
      onAllRowsInCurrentPageCheck({
        currentPage,
        items : _items,
        status : "select"
      });
    }
  };

  const handleSearch = (searchText : string) : void => {
    setCurrentPage(1);
    if (searchText && searchText !== "") {
      const searchedResults = search<CameraResponse>(allCameras, searchText, ["id",
        "name"]);
      setCameras(searchedResults);
    } else {
      // clear search
      setCameras(allCameras);
    }
  };

  const handleDisplayingFilter = (e : ChangeEvent<HTMLInputElement>) : void => {
    setCurrentPage(1);

    const _filterType = e.target.value as TableDisplayingFilterType;
    setDisplayingFilterType(_filterType);
    handleDisplayingFilterStates(_filterType);
  };
  const handleDisplayingFilterStates = (_filterType : TableDisplayingFilterType) : void => {
    if (_filterType === TableDisplayingFilterType.Selected) {
      setCameras(checkedCameras);
    } else if (_filterType === TableDisplayingFilterType.Unselected) {
      const uncheckedCameras = allCameras.filter((camera : CameraResponse) => !checkedCameras.some((checkedCamera : CameraResponse) => checkedCamera.id === camera.id));
      setCameras(uncheckedCameras);
    } else if (_filterType === TableDisplayingFilterType.All) {
      setCameras(allCameras);
    }
  };

  // --- ⬇︎ Preparation for Table ⬇︎ --- //
  const tableColumns = [
    {
      label : "Camera",
      path : "name"
    },
    {
      label : "Id",
      path : "id"
    },
    {
      label : "Location",
      path : "address"
    }
  ];
  const tableHeader: TableHeader = {
    columns : tableColumns,
    isAllCheckEnabled : isSelectAllEnabled,
    isAllRowChecked : selectAllBehavior === TableSelectAllBehavior.ALL_PAGE
      ? checkedCameras.length === allCameras.length
      : isCurrentPageAllSelected,
    onAllRowsCheck : () => {
      if (selectAllBehavior === TableSelectAllBehavior.ALL_PAGE) {
        if (checkedCameras.length === allCameras.length) onAllRowsCheck([]);
        else onAllRowsCheck(allCameras);
      } else if (selectAllBehavior === TableSelectAllBehavior.CURRENT_PAGE && onAllRowsInCurrentPageCheck) {
        setIsCurrentPageAllSelected(!isCurrentPageAllSelected);

        if (isCurrentPageAllSelected) {
          onAllRowsInCurrentPageCheck({
            currentPage,
            items : paginatedList,
            status : "clear"
          });
        } else {
          onAllRowsInCurrentPageCheck({
            currentPage,
            items : paginatedList,
            status : "select"
          });
        }
      }
    }
  };

  const renderCell = (row: CameraResponse, column: TableColumn): string => {
    if (column.path === "id") {
      row = {
        ...row,
        id : row.id.substring(0, 6).toUpperCase()
      };
    } else if (column.path === "address") {
      row = {
        ...row,
        address : !!row.address ? row.address.substring(0, 30) + "..." : "—"
      };
    }

    if (!!column.path) return _.get(row, column.path);
    else return "—";
  };

  const tableBody: TableBody<CameraResponse> = {
    columns : tableColumns,
    rows : paginatedList,
    renderCell
  };

  const tableFooter = {
    totalItemsCount : cameras.length,
    currentPage,
    limit : pageSize,
    isPageLimitControlEnabled : true,
    pageLimitControl : { handlePageLimitChange : (pageSize : number) => handlePageSizeChange(pageSize) },
    handlePageChange
  };

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    setIsLoading(true);

    if (selectedSite?.id) getCamerasBySite(selectedSite.id);
    else getAllCameras();

    setIsLoading(false);
  }, [selectedSite]);

  // if all items of currentPage is already selected (expecially for updating site), select global all-check
  useEffect(() => {
    const areAllArray1ItemsIncludedInArray2 = paginatedList.every((item1 : CameraResponse) => _.some(checkedCameras, (item2 : CameraResponse) => item2.id === item1.id));
    if (selectAllBehavior === TableSelectAllBehavior.CURRENT_PAGE && areAllArray1ItemsIncludedInArray2) {
      onAllRowsInCurrentPageCheck({
        currentPage,
        items : paginatedList,
        status : "select"
      });
    }
  }, [currentPage]);

  useEffect(() => {
    if (selectAllBehavior === TableSelectAllBehavior.CURRENT_PAGE) {
      const isCurrentPageItemsAllSelected = checkedCameras.length > 0 && paginatedList.every((item1 : CameraResponse) => _.some(checkedCameras, (item2 : CameraResponse) => item2.id === item1.id));
      if (isCurrentPageItemsAllSelected) setIsCurrentPageAllSelected(true);
      else setIsCurrentPageAllSelected(false);

      if (displayingFilterType === TableDisplayingFilterType.Selected) setCameras(checkedCameras);
    }
  }, [pageSize,
    currentPage,
    checkedCameras,
    displayingFilterType,
    paginatedList,
    selectAllBehavior]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize,
    displayingFilterType]);

  return (
    <Modal isOpen={isOpen} size="lg" fade={false}>
      <ModalBody>
        <h5 className="px-4">Add Cameras</h5>
        <Table
          theme={TableTheme.light}
          bodyScroll={true}
          // row checks
          isAllCheckEnabled={ isSelectAllEnabled }
          rowCheck={{
            isMaxCheckableCountReached,
            checkedRows : checkedCameras,
            currentPage, // needs for selecteing all items in currentPage
            paginatedList, // needs for selecting all items in currentPage
            onCheckChange : onRowCheck
          }}
          // actions
          actionBar={{
            search : {
              placeholder : "Search by Camera name",
              handleSearch : (searchText : string) => handleSearch(searchText)
            },
            displayingFilter : {
              filterType : displayingFilterType,
              handleFilter : (e : ChangeEvent<HTMLInputElement>) => handleDisplayingFilter(e)
            }
          }}
          Actions={ selectedSite ?
            <div className="d-flex flex-column">
              Site
              <div className="p-2 text-gray rounded-3" style={{ backgroundColor : "rgba(229, 72, 77, 0.3)" }}>{selectedSite?.name}</div>
            </div> : null
          }
          // api status
          isLoading={isLoading}
          reloadData={(): void => console.log("reload")}
          // content
          header={tableHeader}
          body={tableBody}
          footer={tableFooter}
        />
      </ModalBody>
      {/* footer */}
      <div
        style={{
          display : "flex",
          justifyContent : footerMessage !== "" ? "space-between" : "flex-end",
          padding : "1rem",
          paddingTop : 0
        }}>
        <div className="text-danger">{footerMessage}</div>
        <div className="d-flex gap-2">
          <Button className="rounded rounded-3" color="gray" onClick={() : void => onModalClose(undefined, "close")}>Cancel</Button>
          <Button
            data-test="add-cameras-modal__confirm-btn"
            className="rounded rounded-3 text-white"
            color="primary"
            style={{
              opacity : !footerMessage ? 1 : 0.5,
              cursor : !footerMessage ? "pointer" : "not-allowed"
            }}
            onClick={() : void => {
              if (!footerMessage) {
                onCamerasAdd();
                onModalClose(undefined, "close");
              }
            }}>
            { submitButtonLabel }
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCamerasTableModal;
