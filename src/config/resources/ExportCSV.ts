import { Response } from 'express';
import { Parser } from 'json2csv';

class ExportCSV {

    static async downloadCSV(res: Response, fileName: string, fields: { label: string, value: string }[], data: Array<any>) {
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment(fileName + '.csv');
        return res.status(206).json(csv);
    }

}

export default ExportCSV;