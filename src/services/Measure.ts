import { Measure } from "../models/Measure";

export const getMeasures = async (): Promise<Measure[]> => {
    const resp = await fetch("http://localhost:3000/measures")
    const data = await resp.json();

    return data;
}

export const newMeasure = async (newMeasure: Measure) => {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeasure)
    };

    fetch('http://localhost:3000/measures', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}

export const updateMeasure = async (measure: Measure) => {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measure)
    };

    fetch(`http://localhost:3000/measures/${measure.id}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}