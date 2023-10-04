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