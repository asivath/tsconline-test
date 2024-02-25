import { assertTimescaleDataWithoutHeader } from "@tsconline/shared";
import XLSX from "xlsx";

export async function parseExcelFile(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheetName: string = workbook.SheetNames[0] || "";
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  const jsonData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const dataWithoutHeader = jsonData.slice(1);

  // if (dataWithoutHeader.length > 0) {
  //   dataWithoutHeader[0] = dataWithoutHeader[0].slice(3);
  // } else {
  //   assertTimescaleDataWithoutHeader(dataWithoutHeader);
  // }

  if (!dataWithoutHeader || dataWithoutHeader.length === 0) {
    assertTimescaleDataWithoutHeader(dataWithoutHeader);
    return []; 
  }

  if (dataWithoutHeader[0]) {
    dataWithoutHeader[0] = dataWithoutHeader[0].slice(3);
  }

  return dataWithoutHeader;
}
