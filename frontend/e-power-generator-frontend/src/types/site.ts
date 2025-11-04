// src/types/site.ts

import SiteList from "../pages/SiteList";

// 定義發電機的資料結構
export interface Site {
  ID: number;
  Name: string;
  Address: string;
  Contact_json: string;
}
