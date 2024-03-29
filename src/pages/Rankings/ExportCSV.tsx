// XLSX & FileSaver
import { utils, WorkBook, write } from "xlsx";
import { saveAs } from 'file-saver';

// Types
import { Product } from "../../models/Product";
import { UserRanking } from "../../models/UserRanking";
import { Movement } from "../../models/Movement";
import { IExportCSVProps } from "../../interfaces/IExportCSVProps";

// Functions
import { dateToString } from "./rankingFunctions";

// Assets
import { RiFileExcel2Line } from "react-icons/ri";

export const ExportCSV = ({ csvData, rankingType, rankingOpc, startDate, endDate, }: IExportCSVProps) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const handleExcelDownload = async (csvData: any, rankingType: string, rankingOpc: number, startDate: Date | null, endDate: Date | null,) => {
        switch (rankingOpc) {
            case 1: const fileNameProductRanking = startDate && endDate ? `${rankingType} ${dateToString(startDate)} to ${dateToString(endDate)}` : `${rankingType}`;
                exportProductRankingToCSV(csvData, fileNameProductRanking);
                break;

            case 2: const fileNameUserRanking = startDate && endDate ? `${rankingType} ${dateToString(startDate)} to ${dateToString(endDate)}` : `${rankingType}`;
                exportClientRankingToCSV(csvData, fileNameUserRanking);
                break;

            case 3: const fileNameMovements = startDate && endDate ? `${rankingType} ${dateToString(startDate)} to ${dateToString(endDate)}` : `${rankingType}`;
                exportMovementsToCSV(csvData, fileNameMovements);
                break;
            default: console.log('Incorrect Option');
                return;
        }
    }

    const exportProductRankingToCSV = (csvData: Product[], fileName: string) => {
        let foodTable = [
            {
                A: "NAME",
                B: "CATEGORY",
                C: "ACTIVE",
                D: "PRICE",
                E: "QTY. SOLD",
            },
        ];

        let drinksTable = [
            {
                A: "NAME",
                B: "CATEGORY",
                C: "ACTIVE",
                D: "PRICE",
                E: "QTY. SOLD",
            },
        ];

        csvData.filter((product: Product) => product.subcategory_fk?.name !== 'Bebidas' && product.subcategory_fk?.parentCategory?.name !== 'Bebidas').map((product) => {
            foodTable.push({
                A: product.name,
                B: product.subcategory_fk?.name ? product.subcategory_fk?.name : '',
                C: product.active ? 'Active' : 'Not Active',
                D: String(product.quantity_sold),
                E: String(product.price),
            });
        });

        csvData.filter((product: Product) => product.subcategory_fk?.name === 'Bebidas' || product.subcategory_fk?.parentCategory?.name === 'Bebidas').map((product) => {
            drinksTable.push({
                A: product.name,
                B: product.subcategory_fk?.name ? product.subcategory_fk?.name : '',
                C: product.active ? 'Active' : 'Not Active',
                D: String(product.quantity_sold),
                E: String(product.price),
            });
        });

        const foodDataFinal = [...[{ A: "PRODUCT RANKING" }, {}], ...foodTable];
        const drinkDataFinal = [...[{ A: "DRINK RANKING" }, {}], ...drinksTable];

        const foodSheet = utils.json_to_sheet(foodDataFinal, { skipHeader: true });
        const drinkSheet = utils.json_to_sheet(drinkDataFinal, { skipHeader: true });

        foodSheet["!merges"] = [
            utils.decode_range("A1:E1"),
        ];
        drinkSheet["!merges"] = [
            utils.decode_range("A1:E1"),
        ];

        let properties: any = [];
        const longitude = [25, 25, 15, 6, 11];

        longitude.forEach((col) => {
            properties.push({
                width: col,
            });
        });

        foodSheet["!cols"] = properties;
        drinkSheet["!cols"] = properties;

        const workbook = { Sheets: { 'Food Ranking': foodSheet, 'Drinks Ranking': drinkSheet }, SheetNames: ['Food Ranking', 'Drinks Ranking'] };

        saveExcel(workbook, fileName);
    }

    const exportClientRankingToCSV = (csvData: UserRanking[], fileName: string) => {
        let table = [
            {
                A: "FULL NAME",
                B: "ORDER QTY.",
                C: "TOTAL. SPENT",
            },
        ];

        csvData.map((user: UserRanking) => {
            table.push({
                A: `${user.first_name} ${user.last_name}`,
                B: String(user.orders_quantity),
                C: String(user.total_sum),
            });
        });

        const dataFinal = [...[{ A: "USER RANKING" }, {}], ...table];

        const sheet = utils.json_to_sheet(dataFinal, { skipHeader: true });

        sheet["!merges"] = [
            utils.decode_range("A1:E1"),
        ];

        let properties: any = [];
        const longitude = [25, 25, 25];

        longitude.forEach((col) => {
            properties.push({
                width: col,
            });
        });

        sheet["!cols"] = properties;


        const workbook = { Sheets: { 'Client Ranking': sheet }, SheetNames: ['Client Ranking'] };
        saveExcel(workbook, fileName);
    }

    const exportMovementsToCSV = (csvData: Movement[], fileName: string) => {
        let table = [
            {
                A: "MOVEMENT TYPE",
                B: "DATE / HOUR",
                C: "DESCRIPTION",
                D: "AMOUNT"
            },
        ];

        csvData.map((movement: Movement) => {
            table.push({
                A: String(movement.type.replace("_", " ")),
                B: String(movement.date.replace(" ", " / ")),
                C: String(movement.description.replaceAll(`"`, "")),
                D: String(movement.total)
            });
        });

        const dataFinal = [...[{ A: "MOVEMENTS" }, {}], ...table];
        const sheet = utils.json_to_sheet(dataFinal, { skipHeader: true });

        sheet["!merges"] = [
            utils.decode_range("A1:E1"),
        ];

        let properties: any = [];
        const longitude = [25, 25, 35, 15];

        longitude.forEach((col) => {
            properties.push({
                width: col,
            });
        });

        sheet["!cols"] = properties;

        const workbook = { Sheets: { 'Movements': sheet }, SheetNames: ['Movements'] };
        saveExcel(workbook, fileName);
    }

    const saveExcel = (workbook: WorkBook, fileName: string) => {
        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, fileName + fileExtension);
    }

    return (
        <div>
            <button className="text-white btn btn-success btn-sm btn-wide" onClick={() => handleExcelDownload(csvData, rankingType, rankingOpc, startDate, endDate)}><RiFileExcel2Line />EXPORT EXCEL</button>
        </div>
    )
}