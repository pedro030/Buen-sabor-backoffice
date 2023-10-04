import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';
import { Product } from "../../models/Product";
import { UserRanking } from "../../models/UserRanking";
import { dateToString } from "./rankingFunctions";

interface Props {
    csvData: any,
    rankingType: string,
    rankingOpc: number,
    startDate: Date | null,
    endDate: Date | null
}

export const ExportCSV = ({csvData, rankingType, rankingOpc, startDate, endDate,}: Props) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const handleExcelDownload = async (csvData: any, rankingType: string, rankingOpc: number, startDate: Date | null, endDate: Date | null, ) => {
        
        switch(rankingOpc) {
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
        const formatFoodRanking = csvData.filter((product: Product) => product.subcategory_fk?.name !== 'Bebidas' && product.subcategory_fk?.parentCategory?.name !== 'Bebidas').map((item: Product) => ({
            NAME: item.name,
            CATEGORY: item.subcategory_fk?.name,
            'QTY. SOLD': item.quantity_sold,
            ACTIVE: item.active ? 'Active' : 'Not Active',
            PRICE: item.price
        }));

        const formatDrinksRanking = csvData.filter((product: Product) => product.subcategory_fk?.name === 'Bebidas' || product.subcategory_fk?.parentCategory?.name === 'Bebidas').map((item: Product) => ({
            NAME: item.name,
            CATEGORY: item.subcategory_fk?.name,
            'QTY. SOLD': item.quantity_sold,
            ACTIVE: item.active ? 'Active' : 'Not Active',
            PRICE: item.price
        }));
        const foodSheet = XLSX.utils.json_to_sheet(formatFoodRanking);
        const drinksSheet = XLSX.utils.json_to_sheet(formatDrinksRanking);
        const workbook = { Sheets: { 'Food Ranking': foodSheet, 'Drinks Ranking': drinksSheet }, SheetNames: ['Food Ranking', 'Drinks Ranking']};
        saveExcel(workbook, fileName);
    }

    const exportClientRankingToCSV = (csvData: UserRanking[], fileName: string) => {
        const formatUserRanking = csvData.map((item: UserRanking) => ({
            'FULL NAME': `${item.first_name} ${item.last_name}`,
            'ORDER QTY.': item.orders_quantity,
            'TOTAL. SPENT': item.total_sum,
        }));
        const clientSheet = XLSX.utils.json_to_sheet(formatUserRanking);
        const workbook = { Sheets: { 'Client Ranking': clientSheet }, SheetNames: ['Client Ranking']};
        saveExcel(workbook, fileName);
    }

    const exportMovementsToCSV = (csvData: Product[], fileName: string) => {
        const formatFoodRanking = csvData.filter((product: Product) => product.subcategory_fk?.name !== 'Bebidas' && product.subcategory_fk?.parentCategory?.name !== 'Bebidas').map((item: Product) => ({
            NAME: item.name,
            CATEGORY: item.subcategory_fk?.name,
            'QTY. SOLD': item.quantity_sold,
            ACTIVE: item.active ? 'Active' : 'Not Active',
            PRICE: item.price
        }));

        const foodSheet = XLSX.utils.json_to_sheet(formatFoodRanking);
        const workbook = { Sheets: { 'Food Ranking': foodSheet }, SheetNames: ['Food Ranking']};
        saveExcel(workbook, fileName);
    }

    const saveExcel = (workbook: XLSX.WorkBook, fileName: string) => {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], { type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    

    return (
        <div>
            <button className="text-white btn btn-success" onClick={() => handleExcelDownload(csvData, rankingType, rankingOpc, startDate, endDate)}><RiFileExcel2Line />EXPORT EXCEL</button>
        </div>
    )
}