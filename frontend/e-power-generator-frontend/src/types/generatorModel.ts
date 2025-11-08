// src/types/generatorModel.ts

export interface GeneratorModelSpec {
    SpecName: string;
    SpecValue: string;
}

// 定義發電機的資料結構
export interface GeneratorModel {
    ID: number;
    Name: string;
    Power: number;
    spec: GeneratorModelSpec[];
    SpecImgPath: string;
    MachineImgPath: string;
    OtherImgPath: string[];
}