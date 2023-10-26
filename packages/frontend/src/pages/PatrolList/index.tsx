import React, {
  memo,
  useEffect,
  useState
} from "react";
import {
  useHistory,
  useLocation
} from "react-router-dom";
import { Button } from "reactstrap";
import { AiOutlineEye } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";

import Table from "components/Table";
import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";
import AvatarsOverlay from "components/AvatarsOverlay";

import {
  CalendarDateRange,
  TableHeader
} from "model-type/component-style";
import {
  PATROL_CREATE_PATH,
  PATROL_MANAGE_PATH
} from "data/route-path";

import { getInfo } from "model/user-account";
import { fetchRoutes } from "services/route";
import { getFormattedDate } from "utils/time-format";
import { renderCommonCell } from "utils/table";

import { 
  RouteResponse,
  MiniUserResponse 
} from "@vps/utils/lib/dto";

function VirtualPatrolPage() : JSX.Element {
  const history = useHistory();
  const location = useLocation();

  // --- ⬇︎ START - STATES ⬇︎ ---  //
  const [
    routes,
    setRoutes
  ] = useState<RouteResponse[]>([]);
  const [
    totalCount,
    setTotalCount
  ] = useState(0);
  const [
    limit,
    setLimit
  ] = useState(10);
  const [
    currentPage,
    setCurrentPage
  ] = useState(1);
  const [dateRange,
    setDateRange] = useState<CalendarDateRange>({
      from : null,
      to : null
    });
  const [searchText,
    setSearchText] = useState<string>(null);
  const [
    isLoading,
    setIsLoading
  ] = useState(false);

  const getRoutes = async (
    limit : number,
    currentPage : number,
    searchText : string,
    dateRange : CalendarDateRange
  ) : Promise<void> => {
    setIsLoading(true);
    const offset = (currentPage - 1) * limit;
    const {
      data,
      count
    } = await fetchRoutes(limit, offset, searchText, dateRange);
    setRoutes(data);
    setTotalCount(count);
    setIsLoading(false);
  };

  // --- ⬇︎ Action Handlers ⬇︎ --- //
  const handlePageChange = (page : number) : void => {
    setCurrentPage(page);
    getRoutes(limit, page, searchText, dateRange);
  };

  const handlePageLimitChange = (value : number) : void => {
    setLimit(value);
    if (currentPage != 1) {
      setCurrentPage(1);
    }
    getRoutes(value, 1, searchText, dateRange);
  };

  // --- ⬇︎ Search ⬇︎ --- //
  const handleSearch = (searchValue : string) : void => {
    setSearchText(searchValue);
    if (currentPage != 1) {
      setCurrentPage(1);
    }
    getRoutes(limit, 1, searchValue, dateRange);
  };

  // --- ⬇︎ Date Range ⬇︎ --- //
  const handleDateRangeSelect = (_selectedDateRange : CalendarDateRange) : void => {
    setDateRange(_selectedDateRange);
    // reset table current page
    if (currentPage != 1) {
      setCurrentPage(1);
    }
    getRoutes(limit, 1, searchText, _selectedDateRange);
  };

  const handlePatrolRouteDetailsView = (row : RouteResponse) : void => {
    const redirectPath = PATROL_MANAGE_PATH.replace(":routeId", row.id);
    history.push({
      pathname : redirectPath,
      state : {
        searchText,
        dateRange,
        limit,
        currentPage
      }
    });
  };

  // --- ⬇︎ Preparations for Table ⬇︎ --- //
  const tableColumns = [
    {
      label : "Patrol Name",
      path : "name"
    },
    {
      label : "Site Name",
      path : "site.name"
    },
    {
      label : "Created by",
      content : (row : RouteResponse) : JSX.Element => {
        return (
          <div className="d-flex justify-content-start align-items-center gap-2">
            <div className="tcell-avatar-inner-wrapper">
              {row.createdUserAvatar ? <img className="img-content" src={row.createdUserAvatar} /> : <div className="img-content d-flex justify-content-center align-items-center" ><FaUserAlt size={10} color="white" /></div>}
            </div>
            { row.createdUserName }
          </div>
        );
      }
    },
    {
      label : "Created On",
      content : (row : RouteResponse) => <>{getFormattedDate(new Date(row.createdAt))}</>
    },
    {
      label : "Assignees",
      content : (row : RouteResponse) : JSX.Element => {
        const currentUserId = getInfo().accountId;
        const data = row.assignedUsers;

        // place `my avatar` at the front
        data.sort((a : MiniUserResponse, b : MiniUserResponse) => {
          if (a.id === currentUserId) return -1;
          else if (b.id === currentUserId) return 1;
          return 0;
        });

        // place users with avatar at the front
        const updatedData = data
          .filter((item : MiniUserResponse) : boolean => item.avatar !== null && item.avatar !== undefined)
          .map((item : MiniUserResponse) => {
            if (item.id === currentUserId) {
              return {
                ...item,
                name : `You (${item.name})`
              };
            }
            return item;
          })
          .concat(data.filter((item : MiniUserResponse) : boolean => item.avatar === null || item.avatar === undefined));

        return (
          <div className="d-flex justify-content-start align-items-center">
            <AvatarsOverlay items={updatedData} />
          </div>
        );
      }
    },
    {
      label : "Action",
      content : (row : RouteResponse) => (
        <div data-test="table__view-details" className="d-flex justify-content-center" onClick={ () : void => handlePatrolRouteDetailsView(row) }>
          <AiOutlineEye
            size={ 15 }
            style={ { cursor : "pointer" } }
          />
        </div>
      )
    }
  ];

  const tableHeader : TableHeader = { columns : tableColumns };

  const tableBody = {
    columns : tableColumns,
    rows : routes,
    renderCell : renderCommonCell
  };

  const tableFooter = {
    totalItemsCount : totalCount,
    currentPage,
    limit,
    handlePageChange,
    pageLimitControl : { handlePageLimitChange }
  };

  // --- ⬇︎ UseEffects ⬇︎ --- /
  useEffect(() => {
    if (location.state) {
      const { prevPageStateValues } = location.state;

      if (!!prevPageStateValues) {
        const {
          searchText,
          dateRange,
          limit,
          currentPage
        } = prevPageStateValues;
        if (searchText) setSearchText(searchText);
        if (dateRange) setDateRange(dateRange);
        if (limit) setLimit(limit);
        if (currentPage) setCurrentPage(currentPage);

        getRoutes(limit, currentPage, searchText, dateRange);
      }
    } else {
      getRoutes(10, 1, null, null);
    }

    const clearStateValues = () : void => {
      if (location.state) {
        history && history.replace({
          ...history.location,
          state : null
        });
      }
      setSearchText(null);
      setDateRange({
        from : null,
        to : null
      });
      setLimit(10);
      setCurrentPage(1);
    };

    window.addEventListener("beforeunload", clearStateValues);

    return () => {
      window.removeEventListener("beforeunload", clearStateValues);
    };
  }, [
    history,
    location.state
  ]);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="test-page">
        <PageHeaderTitle
          title="Virtual Patrol Routes"
          ActionComponents={
            <Button
              data-test="patrols-list__btn-create"
              color="primary"
              className="rounded-3"
              onClick={ () : void => {
                history && history.push(PATROL_CREATE_PATH);
              } }>
              Create Patrol Route
            </Button>
          }
        />

        <div data-test="patrols-list__table">
          <Table
            actionBar={ {
              search : {
                placeholder : "Search by Patrol name",
                handleSearch : (searchValue : string) : void => handleSearch(searchValue),
                value : searchText
              },
              dateRangePicker : {
                selectedRange : dateRange,
                handleDateRangeSelect : handleDateRangeSelect
              }
            } }
            isLoading={ isLoading }
            reloadData={ () : void => {
              getRoutes(limit, currentPage, searchText, dateRange);
            } }
            header={ tableHeader }
            body={ tableBody }
            footer={ tableFooter }
          />
        </div>
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(VirtualPatrolPage);
