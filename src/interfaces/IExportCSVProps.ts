import { Movement } from "../models/Movement";
import { Product } from "../models/Product";
import { UserRanking } from "../models/UserRanking";

export interface IExportCSVProps {
    csvData: Product[] | UserRanking[] | Movement[],
    rankingType: string,
    rankingOpc: number,
    startDate: Date | null,
    endDate: Date | null
}