import path from 'path';
import Validator from 'validator';
import db from '../models/index.js';

const { Results, Users } = db;

class ExcelValidators {
  static checkFileType(file) {
    return path.extname(file.name) === '.xlsx';
  }

  static checkEmptySheet(arr) {
    return !arr.length;
  }

  static checkCorrectFormat(file, dataInputs) {
    for (let input of dataInputs) {
      if(!file[0][input]) {
        return false;
      }
    }
    return true;
  }

  static checkEmptyInput(input) {
    if (input === 'empty' || input === '') {
      return 'Cannot be empty'
    }
  }

  static validateYear(year) {
    if (!Validator.isNumeric(year) || year.length !== 4) {
      return 'Invalid year';
    }
  }

  static validateName(name) {
    if (!Validator.isAlpha(name.replace(/-/g, ''))) {
      return 'Name should only contain letters'
    }
  }

  static validateDob(dob) {
    if (!Validator.isISO8601(dob)) {
      return 'Invalid date format'
    }
  }

  static validateRole(role) {
    if (!['student', 'teacher', 'admin', 'super admin'].includes(role)) {
      return 'Invalid role'
    }
  }

  static validatePhone(phone) {
    if (!Validator.isMobilePhone(phone)) {
      return 'Invalid phone number';
    }
  }

  static validateEmail(email) {
    if (!Validator.isEmail(email)) {
      return 'Invalid email'
    }
  }

  static validateTerm(term) {
    if (!['1', '2', '3'].includes(term)) return 'Invalid term number'
  }

  static validateMark(mark) {
    if (!mark.match(/^\d+\/\d+$/)) {
      return 'Mark should be "number/number"'
    }
  }

  static isAlphanumeric(value) {
    if (!Validator.isAlphanumeric(value)) {
      return 'Should only be letters & numbers'
    }
  }

  static isAlpha(value) {
    if (!Validator.isAlpha(value)) {
      return 'Should only contain letters'
    }
  }

  static checkUid(results) {
    let errs = {};
    for (let i = 0; i < results.length; i++) {
      if (!results[i].user_uid) {
        errs[i] = 'User not found'
      }
    }
    return errs;
  }

  static addSchoolUid(data, school_uid) {
    for (let row of data) {
        row.school_uid = school_uid
      }
      return data;
    }

  static emptyToNull(users, dataInputs) {
    for (let user of users) {
      for (let input of dataInputs) {
        if (user[input] === 'empty') {
          user[input] = null;
        }
      }
    }
    return users;
  }

  static addStudentResultId(results) {
    for (let result of results) {
      result.student_result_id = `${result.user_uid}.${result.year}.${result.term}.${result.exam}`
    }
    return results;
  }

  static updateStudentResultId(student_result_id, updatedData) {
    const oldData = student_result_id.split('.');
    const result = {
      user_uid: oldData[0],
      year: updatedData.year || oldData[1],
      term: updatedData.term || oldData[2],
      exam: updatedData.exam || oldData[3]
    }
    return ExcelValidators.addStudentResultId([result]);
  }

  static dataToString(data) {
    for (let record of data) {
      for (let input of Object.keys(record)) {
        if (typeof record[input] !== "string") {
          const stringData = record[input].toString();
          record[input] = stringData;
        }
      }
    }
    return data;
  }

  static checkString(value) {
    if (typeof value !== "string") {
      return "Should be a string"
    }
  }

  static checkStringsInObjs(data) {
    let errs = {};
    for (let i = 0; i < data.length; i++) {
      let recordErrs = {};
      for (let input of Object.keys(data[i])) {
        if (typeof data[i][input] !== "string") {
          recordErrs[input] = "Should be a string"
        }
      }
      if (Object.keys(recordErrs).length) {
        errs[i] = recordErrs;
      }
    }
    return errs;
  }

  static async checkResultTableDuplicate(results) {
    try {
      let errs = {};
      for (let i = 0; i < results.length; i++) {
        const { student_result_id } = results[i];
        const found = await Results.findOne({
          where: {
            student_result_id,
          }
        })
        if (found) {
          errs[i] = 'Duplicate record found'
        }
      }
      return errs;
    } catch(err) {
      return `Error reading result table: ${err}`
    }
  }

  static async checkUserTableEmail(email) {
    try {
      const found = await Users.findOne({
        where: {
          email: email,
        }
      })
      if (found) {
        return 'Email already registered'
      }
    } catch (err) {
      return err
    }
  }

  static async checkUserTableDuplicate(users) {
    try {
      let errs = {};
      for (let i = 0; i < users.length; i++) {
        const { email } = users[i];
        const found = await Users.findOne({
          where: {
            email,
          }
        })
        if (found) {
          errs[i] = 'Email already registered'
        }
      }
      return errs;
    } catch(err) {
      return `Error reading result table: ${err}`
    }
  }

  static checkFileDuplicates(file, id) {
    const duplicates = file.reduce((obj, item, index) => {
      const key = item[id];
      obj[key] = obj[key] ? obj[key].concat([index]) : [index];
      return obj;
    }, {});

    const duplicatesKey = Object.keys(duplicates);

    for (let key of duplicatesKey) {
      const group = duplicates[key];
      if (group.length === 1) {
        delete duplicates[key]
      }
    }
    return duplicates;
  }

  static fileDuplicateMessage(duplicates) {
    let duplicateGroups = [];
    const duplicatesKey = Object.keys(duplicates);
    for (let key of duplicatesKey) {
      const excelGroup = duplicates[key].map(x => x + 2);
      duplicateGroups.push(excelGroup);
    }
    const sortedGroups = duplicateGroups.sort((a, b) => a[0] - b[0]);
    return { duplicates: sortedGroups };
  }
}

export default ExcelValidators;
