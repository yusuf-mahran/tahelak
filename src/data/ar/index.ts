import { navMenu, ctaMenu } from './navMenu';
import { landingData } from './landing';
import { authData } from './auth';
import {
  backLink,
  dashboardSidebarItems,
  registrationSidebarItems,
} from './dashboardSidebar';
import { medicalTitles, stats } from './dashboard';
import { errorsData } from './errors';
import { infoMessages } from './info';

const arData = {
  navMenu,
  ctaMenu,
  landingData,
  auth: authData,
  registrationSidebarItems,
  dashboardSidebarItems,
  backLink,
  errorsData,
  infoMessages,

  // staticData
  medicalTitles,

  // dashboard
  stats,
};

export default arData;
