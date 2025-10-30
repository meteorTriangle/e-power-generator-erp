// src/types/generator.ts

// '可用', '租賃中', '維修中'
export type GeneratorStatus = '可用' | '租賃中' | '維修中' | 'default';

// 定義發電機的資料結構
export interface Generator {
  id: string;
  model: string;
  name: string;
  status: GeneratorStatus;
  location: string;
  powerKW: number;
}