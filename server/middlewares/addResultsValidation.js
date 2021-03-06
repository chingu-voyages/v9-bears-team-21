import ExcelValidators from '../helpers/excelValidators';
import formatExcel from '../helpers/formatExcel';
import emailToUid from '../helpers/emailToUid';
import sendError from '../helpers/sendError';
import { toLowerCase } from '../helpers/convertToLowerCase';
import convertIndexToExcelRow from '../helpers/convertIndexToExcelRow';
import { removeUndefinedInputs } from '../helpers/removeUndefinedInputs.js';

const dataInputs = ['email', 'year', 'term', 'subject', 'exam', 'mark', 'grade'];

class addResultsValidation {

  static async validateAddResults(req, res, next) {
    try {
      if (!req.files || !Object.keys(req.files).length) return sendError(res, 400, 'No files were uploaded');

      const file = req.files.addResults;

      if (!file || !Object.keys(file).length) return sendError(res, 400, 'Incorrect file name');

      if (!ExcelValidators.checkFileType(file)) return sendError(res, 422, 'Wrong file type');

      let results = formatExcel(file);

      // converts all data to lower case
      results = Object.values(toLowerCase(results));

      if (ExcelValidators.checkEmptySheet(results)) return sendError(res, 422, 'File does not contain results')

      if (!ExcelValidators.checkCorrectFormat(results, dataInputs)) return sendError(res, 422, 'Data is in incorrect format. Please use template')

      const inputErrs = addResultsValidation.checkInputs(results);

      if (Object.keys(inputErrs).length) return sendError(res, 422, convertIndexToExcelRow(inputErrs));

      results = await emailToUid(results);
      const uidErrs = ExcelValidators.checkUid(results);

      if (Object.keys(uidErrs).length) return sendError(res, 422, convertIndexToExcelRow(uidErrs))

      results = ExcelValidators.addSchoolUid(results, req.session.school_uid);
      results = ExcelValidators.addStudentResultId(results);

      const fileDuplicates = ExcelValidators.checkFileDuplicates(results, 'student_result_id');

      if (Object.keys(fileDuplicates).length) return sendError(res, 422, ExcelValidators.fileDuplicateMessage(fileDuplicates));

      res.locals.duplicates = await ExcelValidators.checkResultTableDuplicate(results);
      res.locals.results = results
      next();
    }
    catch (err) {
        return sendError(res, 500, err.message);
    }
  }

  static async validateUpdateResults(req, res, next) {
    try {
      const { year, subject, exam, mark, term } = req.body;
      let result = { year, subject, exam, mark, term };
      result = toLowerCase(result);
      let resultUpdatedInputs = removeUndefinedInputs([result]);
      const inputErrs = addResultsValidation.checkInputs(resultUpdatedInputs);
      if (Object.keys(inputErrs).length) return sendError(res, 422, inputErrs);
      const { student_result_id } = res.locals;
      resultUpdatedInputs = ExcelValidators.updateStudentResultId(student_result_id, resultUpdatedInputs[0]);
      res.locals.result = resultUpdatedInputs[0];
      next();
    } catch(err) {
      return err
    }
  }

  static checkInputs(results) {
    let errors = {};
    for (let i = 0; i < results.length; i++) {
      let resultErrors = {};
      const resultRow = i;
      for (let input of Object.keys(results[i])) {
        const value = results[i][input];
        // Validator only accepts strings
        let stringError = ExcelValidators.checkString(value);
        if (stringError) {
          resultErrors[input] = stringError
        } else {
          let inputError = ExcelValidators.checkEmptyInput(value);
          const validatorKey = {
            email: ExcelValidators.validateEmail(value),
            year: ExcelValidators.validateYear(value),
            term: ExcelValidators.validateTerm(value),
            subject: ExcelValidators.isAlpha(value),
            exam: ExcelValidators.isAlphanumeric(value),
            mark: ExcelValidators.validateMark(value),
            grade: ''
          };
          inputError = inputError || validatorKey[input];
          if (inputError) resultErrors[input] = inputError;
        }
      }
    if (Object.keys(resultErrors).length) errors[resultRow] = resultErrors;
    }
  return errors;
  }
}

export default addResultsValidation;
