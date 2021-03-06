import models from '../models';
import { toLowerCase } from '../helpers/convertToLowerCase';
import sendError from '../helpers/sendError.js';

const { Schools, Users } = models;

/**
 * @class SchoolsController
 * @description School related Operations
 */
class SchoolsController {
  /**
 * @description - creates a new school for an admin
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns user
 */
  static async create(req, res) {
    const { school_name, address_line_1, address_line_2, country, city, postal_code, email } = toLowerCase(req.body);
    const admin_uid = req.session.user_uid;
    const { role, school_uid } = req.session;
    try {
      // check if the admin has a school already or not
      if(school_uid){
        return sendError(res, 409, 'Sorry! An admin is not allow to manage more than a school');
      }

      if (!['admin', 'super admin'].includes(role)) {
        return sendError(res, 401, 'Sorry, you do not have privilege to add new school.Please contact the admin');
      }
      const school = await Schools
        .create({
          school_name, admin_uid, address_line_1, address_line_2, country, city, postal_code, email
        });
      if (school) {
        if (role === 'admin') {
          const { school_uid } = school;
          await Users.update({ school_uid }, {
            where: {
              user_uid: admin_uid
            }
          })
          req.session.school_uid = school_uid;
        }

        return res.status(201).json({
          status: 'success',
          message: 'New account created successfully.',
          school
        });
      }
    } catch (err) {
      return sendError(res, 500, err)
    }
  }
}

export default SchoolsController;
