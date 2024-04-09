import { PortkeyDid } from 'aelf-web-login';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import * as ExcelJS from 'exceljs';
import { getAddressInfo } from 'utils/aelf';
import Papa from 'papaparse';
import { UpdateType } from 'components/UpdateWhitelistUsersButton/types';

export const parseWhitelistFile = async (file: any) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  let _whitelistData: string[];
  try {
    if (isExcel) {
      _whitelistData = await parseWhitelistExcelFile(file);
    } else {
      _whitelistData = await parseWhitelistCSVFile(file);
    }
  } catch (error) {
    return [];
  }
  return _whitelistData;
};

const SPLIT_SYMBOL_LIST = ['\r\n', '\r', ',', '、', '\\|'];
export const parseWhitelistInput = (input: string) => {
  const addressList: string[] = [];
  SPLIT_SYMBOL_LIST.map((symbol) => {
    input = input.replace(new RegExp(symbol, 'g'), '\n');
  });
  input.split('\n').map((line) => {
    line = line.trim();
    if (line) {
      addressList.push(line);
    }
  });
  return addressList;
};

export const parseWhitelistExcelFile = async (file: any) => {
  const addressList: string[] = [];
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  workbook.worksheets.forEach((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        addressList.push(String(cell.value) as string);
      });
    });
  });
  return addressList;
};

export const parseWhitelistCSVFile = (file: any): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      error(err) {
        reject(`Parsing error:${err?.message}`);
      },
      complete(result) {
        try {
          const list: string[] = [];
          const { data } = result;
          data?.map((line) => {
            if (line instanceof Array) {
              line.map((row) => {
                if (row) {
                  list.push(String(row));
                }
              });
            }
          });
          resolve(list);
          return list;
        } catch (e) {
          reject(`${e}`);
        }
      },
    });
  });
};

export type TWhitelistData = string[];
export enum WhitelistAddressIdentifyStatusEnum {
  active = 1,
  exist,
  matchFail,
  repeat,
  notExist,
}
export type TWhitelistIdentifyItem = {
  address: string;
  status: WhitelistAddressIdentifyStatusEnum;
};

export type TIdentifyWhitelistDataParams = {
  originData: TWhitelistData;
  identifyData: TWhitelistData;
  type: UpdateType;
};

export const identifyWhitelistData = ({ originData, identifyData, type }: TIdentifyWhitelistDataParams) => {
  const originDataMap: Record<string, boolean> = {};
  originData.forEach((address) => {
    originDataMap[address] = true;
  });

  const identifyDataMap: Record<string, boolean> = {};
  const identifyList: TWhitelistIdentifyItem[] = [];
  identifyData.forEach((address) => {
    if (type === UpdateType.ADD) {
      if (originDataMap[address]) {
        identifyList.push({
          address: address,
          status: WhitelistAddressIdentifyStatusEnum.exist,
        });
        return;
      }
    } else {
      if (!originDataMap[address]) {
        identifyList.push({
          address: address,
          status: WhitelistAddressIdentifyStatusEnum.notExist,
        });
        return;
      }
    }

    if (identifyDataMap[address]) {
      return identifyList.push({
        address: address,
        status: WhitelistAddressIdentifyStatusEnum.repeat,
      });
    }
    identifyDataMap[address] = true;

    const addressInfo = getAddressInfo(address);
    if (
      addressInfo.prefix !== 'ELF' ||
      addressInfo.suffix !== DEFAULT_CHAIN_ID ||
      !PortkeyDid.isAelfAddress(addressInfo.address)
    ) {
      identifyList.push({
        address: address,
        status: WhitelistAddressIdentifyStatusEnum.matchFail,
      });
      return;
    }

    identifyList.push({
      address: address,
      status: WhitelistAddressIdentifyStatusEnum.active,
    });
  });

  return identifyList;
};
