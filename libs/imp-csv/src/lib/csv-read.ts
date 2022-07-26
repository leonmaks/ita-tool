import fs from 'fs'
import { parse } from 'csv-parse'
import { ciRecParse, CiRecType } from './ci-rec-parse'

export type CsvRecord = { [header: string]: string }

export type CsvHandlers = {
  recordHandlers: {
    [header: string]: (record: CsvRecord) => void
  }
}

export type CsvMap = {
  [id: string]: CsvRecord
}

export type Csv = {
  ciMap: CsvMap
}

type CsvHdrCnt = {
  [header: string]: number
}

const ciTypes: CsvHdrCnt = {}

export const csvRead = async (csvFile: string, { recordHandlers }: CsvHandlers): Promise<Csv> => {
  //
  const csv: Csv = {
    ciMap: {},
  }
  //
  const regRec = (rec: { [hdr: string]: string }) => {
    if (rec.ci) {
      if (!csv.ciMap[rec.ci]) csv.ciMap[rec.ci] = rec
    }
    rec.ci
    // if (!csv.ciMap[rec.ci]) csv.ciMap[rec.ci] =
  }
  /*
regCI (ci, up):
  CI not exists in CIs
    put CI into CIs
    UP is undef
      put CI into Roots
  Attrs are
    update Attrs
  UP is def
    regCI(UP, undef)
    put CI as child of UP
    del CI from Roots
      */

  //
  try {
    fs.createReadStream(csvFile)
      .pipe(
        parse({
          // CSV options
          bom: true,
          skip_empty_lines: true,
          // ltrim: true,
          columns: (h) => h.map((column: any) => column.toLowerCase()),
          // on_record: (r, _ctx) => {
          //   console.log('on_record: before: r=', r)
          //   r.h_name = r.h_name.replace(/[* ]*/g, '')
          //   console.log('on_record: after: r=', r)
          // },
          // [lines, record[2], record[0]],
        })
      )
      .on('data', async function (r) {
        // console.log('on_record: before: r=', r)
        const ciRec: CiRecType = ciRecParse(r)
        // console.log('on_record: ciRec=', ciRec)
        for await (const [header, handler] of Object.entries(recordHandlers)) {
          if (r[header]) handler(r)
        }
      })
    // .on('end', function () {
    //   //do something with csvData
    //   console.log('end')
    //   // console.log(csvData)
    //   console.log(ciTypes)
    // })
  } finally {
  }
  console.log('csvRead: return')
  return csv
}

const csvRecFns: CsvHandlers = {
  recordHandlers: {
    h_name: (r) => {
      r.ci = r.h_name.replace(/[* ]*/g, '')
    },
    full_path: (r) => {
      r.ci_up = r.full_path.substring(r.full_path.lastIndexOf('/') + 1)
    },
    type: (r) => {
      ciTypes[r.type] = (ciTypes[r.type] || 0) + 1
    },
  },
}

const main = async () => {
  const csv = await csvRead('../../imp-data/runup/CI00636331/220625_0910/tree_full_1.csv', csvRecFns)

  console.log('csv=', csv)
}

if (require.main === module)
  main()
    .then(() => console.log('success'))
    .catch((e) => console.trace(e))
