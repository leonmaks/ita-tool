import fs from 'fs'
import { parse } from 'csv-parse'
import { DictArray, putDictArray } from '@ita-tool/tittles'
import { ciRecParse, CiRecType } from './ci-rec-parse'

export type CsvRecType = CiRecType & {
  ci?: string,
  up?: string
}

export type CsvHandlersType = {
  recordHandlers: {
    [header in keyof CsvRecType]?: (record: CsvRecType) => void
  }
}

export type CsvMap = {
  [id: string]: CiRecType
}

export type Csv = {
  ciMap: DictArray<CsvRecType>
}

// type CsvHdrCnt = {
//   [header: string]: number
// }

// const ciTypes: CsvHdrCnt = {}

export const csvRead = async (csvFile: string, { recordHandlers }: CsvHandlersType): Promise<Csv> => {
  //
  const csv: Csv = {
    ciMap: {},
  }

  const proceedRec = (rec: CsvRecType) => {
    if (!rec.ci) return
    putDictArray(rec.ci, rec, csv.ciMap, true)
    console.log('csv.ciMap=', csv.ciMap)
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
  fs.createReadStream(csvFile)
    .pipe(
      parse({
        // CSV options
        bom: true,
        skip_empty_lines: true,
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

      // Parse & validate CSV record
      const csvRec: CsvRecType = ciRecParse(r)

      // Apply handlers
      for await (const [header, handler] of Object.entries(recordHandlers)) {
        if (csvRec[header as keyof CsvRecType]) handler(csvRec)
      }

      // Proceed & reflect record in CSV maps
      proceedRec(csvRec)

      // console.log('on_record: csvRec=', csvRec)
    })
  // .on('end', function () {
  //   //do something with csvData
  //   console.log('end')
  //   // console.log(csvData)
  //   console.log(ciTypes)
  // })

  console.log('csvRead: return')
  return csv
}

const csvRecFns: CsvHandlersType = {
  recordHandlers: {
    h_name: (r) => {
      r.ci = r.h_name
    },
    full_path: (r) => {
      r.up = r.full_path.slice(-10)
    },
    // type: (r) => {
    //   ciTypes[r.type] = (ciTypes[r.type] || 0) + 1
    // },
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
