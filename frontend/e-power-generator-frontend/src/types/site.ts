// src/types/site.ts

// 定義發電機的資料結構
export interface Site {
  ID: number;
  Name: string;
  Address: string;
  Contact: ContactInfo[];
}

export interface ContactInfo {
    Way: string;
    Value: string;
}