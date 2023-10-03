// Converts string date to Date.
export const stringToDate = (inputDate: string | null) => {
    if(typeof inputDate === 'string') {
        const parts = inputDate.split("-");
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1].length === 1 ? `0${parts[1]}` : parts[1]) - 1;
        const day = parseInt(parts[2].length === 1 ? `0${parts[2]}` : parts[2]);

        return new Date(year, month, day);
    } else return null
  
};

// Converts Date to string
export const dateToString = (date: Date | null) => {
    if(date instanceof Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    } else return null
};

// Handle Excel
export const handleExcelDownload = async (rankingOpc: number, startDate: Date | null, endDate: Date | null, rankingType: string) => {
    try {
        let blob: Blob;

        switch(rankingOpc) {
            case 1: const responseProductRanking = await fetch('url');
                    blob = await responseProductRanking.blob();
                break;

            case 2: const responseClientRanking = await fetch('url');
                    blob = await responseClientRanking.blob();
                break;
            
            case 3: const responseMovements = await fetch('url');
                    blob = await responseMovements.blob();
                break;
            default: console.log('Incorrect Option');
                return;
        }
        
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        startDate && endDate ? link.download = `${rankingType} ${dateToString(startDate)} to ${dateToString(endDate)}.xlsx` : link.download = `${rankingType}.xlsx`;

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
    } catch(e) {
        console.log('Download Error: ', e);
    }
}
