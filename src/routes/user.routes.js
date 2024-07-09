import express from 'express';
import upload from '../middlewares/multerConfig.js';
import { onlyAdminAccess, onlyUsersAccess } from '../middlewares/permissions.js';
import {
  updateUserToPremium,
  uploadUserDocuments,
  uploadUserProfileImage,
  uploadProductImage,
  changeUserRole,
  deleteUser,
  deleteInactiveUsers
} from '../controller/user.controller.js';

const router = express.Router();

router.put('/premium/:uid/', updateUserToPremium);
router.post('/:uid/documents', onlyUsersAccess, upload.array('documents'), uploadUserDocuments);
router.post('/:uid/profile-image', upload.single('profileImage'), uploadUserProfileImage);
router.post('/:pid/image', upload.single('productImage'), uploadProductImage);
router.post('/:uid/change-role', onlyAdminAccess, changeUserRole);
router.delete('/:uid/delete', onlyAdminAccess, deleteUser);
router.delete('/inactive', onlyAdminAccess, deleteInactiveUsers);

export default router;
