import _ from "lodash";
import React, {
  memo,
  useEffect,
  useState
} from "react";
import { useLocation } from "react-router-dom";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import PageHeaderTitle from "components/PageHeaderTitle";
import PageHeaderTab from "components/PageHeaderTab";
import NotificationModal from "components/NotificationModal";
import ConfirmationModal from "components/ConfirmationModal";
import SelectCustom from "components/SelectCustom";
import MonthlyReportIcon from "components/icons/MonthlyReportIcon";
import DailyReportIcon from "components/icons/DailyReportIcon";
import TaskReportIcon from "components/icons/TaskReportIcon";
import ListPatrolReports from "./ListPatrolReports";
import ListDailyReports from "./ListDailyReports";
import ListMonthlyReports from "./ListMonthlyReports";

import {
  ConfirmationModalProps,
  HeaderTab,
  NotificationModalProps
} from "model-type/component-style";
import { fetchSites } from "services/site";
import { REPORT_TABS } from "data/common-data";
import { SiteResponse } from "@vps/utils/lib/dto";

const allSite = {
  id : null,
  name : "All sites",
  description : "",
  noCameras : 0
};

function ReportsPage() : JSX.Element {
  const location = useLocation();
  let tab;
  if (location.state) {
    tab = location.state?.tab;
  }

  const [
    selectedTab,
    setSelectedTab
  ] = useState<REPORT_TABS>(tab || REPORT_TABS.TASK);
  const [sites,
    setSites] = useState<SiteResponse[]>([]);
  const [selectedSite,
    setSelectedSite] = useState<SiteResponse>(null);
  const [selectedSiteId,
    setSelectedSiteId] = useState<string>(null);
  const [
    notifyModal,
    setNotifyModal
  ] = useState<NotificationModalProps>({
    iconType : "notify",
    header : null,
    message : null,
    isOpen : false
  });
  const [
    confirmModal,
    setConfirmModal
  ] = useState<ConfirmationModalProps>({
    header : null,
    message : null,
    isOpen : false,
    confirm : null
  });

  const closeNotifyModal = () : void => {
    setNotifyModal({
      header : null,
      message : null,
      isOpen : false,
      danger : false
    });
  };

  const closeConfirmationModal = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirm : null
    });
  };

  // handlers
  const handleSiteChange = (siteId : string) : void => {
    if (siteId) {
      setSelectedSiteId(siteId);

      const _selectedSite = sites.find((site : SiteResponse) => site.id === siteId);
      setSelectedSite(_selectedSite);
    } else {
      setSelectedSiteId(null);
      setSelectedSite(null);
    }
  };

  const headerTabs : HeaderTab<REPORT_TABS>[] = [
    {
      name : "Report",
      value : REPORT_TABS.TASK,
      count : "Patrol",
      icon : <TaskReportIcon color="white" />
    },
    {
      name : "Summary",
      value : REPORT_TABS.DAILY,
      count : "Daily",
      icon : <DailyReportIcon color="white" />
    },
    {
      name : "Summary ",
      value : REPORT_TABS.MONTHLY,
      count : "Monthly",
      icon : <MonthlyReportIcon color="white" />
    }
  ];

  let tableComponent : JSX.Element = null;
  if (!!selectedTab) {
    switch (selectedTab) {
      case REPORT_TABS.TASK:
        tableComponent = (
          <ListPatrolReports site={ selectedSite } />
        );
        break;
      case REPORT_TABS.DAILY:
        tableComponent = (
          <ListDailyReports site={ selectedSite } />
        );
        break;
      case REPORT_TABS.MONTHLY:
        tableComponent = (
          <ListMonthlyReports site={ selectedSite } />
        );
        break;
    }
  }

  const getSites = async () : Promise<void> => {
    const { data : listSites } = await fetchSites();

    let sortedArray = _.sortBy(listSites, ["id"]).map((obj : SiteResponse) => ({
      ...obj,
      id : parseInt(obj.id)
    })); // currently, returning data's id being string

    // add `All sites` to sites
    sortedArray = [ allSite,
      ...sortedArray];
    setSites(sortedArray);
  };

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    getSites();
  }, []);

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="settings-page">
        <PageHeaderTitle title="Reports" />
        <div className="d-flex justify-content-between align-items-end">
          <PageHeaderTab
            tabs={ headerTabs }
            selectedTabValue={ selectedTab }
            onTabChange={ (value : REPORT_TABS) : void => setSelectedTab(value) }
          />
          <div className="gap-2 align-items-center">
            <div className="mb-2 text-white">Select site</div>
            <div data-test="report-patrol__select-site">
              <SelectCustom
                data={ sites }
                selectedValue={ selectedSiteId || "all" }
                displayedValue={ selectedSite ? selectedSite?.name : "All sites" }
                onChange={ handleSiteChange }
              />
            </div>
          </div>
        </div>

        <div className="mt-4">{ tableComponent }</div>

        <NotificationModal
          color={ notifyModal.color }
          iconType={ notifyModal.iconType }
          isOpen={ notifyModal.isOpen }
          close={ closeNotifyModal }
          header={ notifyModal.header }
          message={ notifyModal.message }
        />
        <ConfirmationModal
          isOpen={ confirmModal.isOpen }
          close={ closeConfirmationModal }
          header={ confirmModal.header }
          message={ confirmModal.message }
          confirm={ confirmModal.confirm }
          confirmBtnText="Confirm"
        />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(ReportsPage);
