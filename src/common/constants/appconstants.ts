import { Expose } from 'class-transformer';
import exp from 'constants';
//USER
export const USER_NOT_EXISTS = 'User not exists';
export const WRONG_CREDENTIALS = 'Wrong Credentials';
export const ELEMENT_ALREADY_EXISTS = 'Element already exists';
export const FAILED_TO_CREATE_ELEMENT = 'Failed to create element';
export const NO_ELEMENT = 'There is no Element';
export const UNABLE_TO_FETCH_ELEMENTS = 'unable to fetch Elements';
export const NO_MACHINE = 'There no Machine';
export const NO_ELEMENT_IN_THIS_MACHINE = 'There is no Element in this Machine';
export const ELEMENT_AND_MACHINE_MISMATCHING =
  'Machine and element is mismatching';
export const ELEMENT_OR_MACHINE_NOT_EXISTS = 'Element/Machine not exists';
export const ELEMENT_DELETED_SUCCESSFULLY = 'Element deleted successfully';
export const GROUP_NOT_EXISTS = 'Group not exists';
export const GROUPNAME_ALREADY_EXISTS = 'groupName already exists';
export const GROUP_ALREADY_EXISTS = 'Group already exists';
export const FAILED_TO_CREATE_GROUP = 'Failed to create Group';
export const FAILED_TO_UPDATE_GROUP = 'Failed to update Group';
export const GROUP_DELEATED_SUCCESSFULLY = 'Group deleted successfully';
export const MACHINE_ALREADY_EXISTS = 'Machine already exists';
export const FAILED_TO_CREATE_MACHINE = 'Failed to create machine';
export const UNABLE_TO_FETCH_MACHINE = 'unable to fetch Machine';
export const NO_MACHINELINE = 'There is no machineLine';
export const NO_MACHINE_IN_THIS_MACHINELINE =
  'There is no Machine in this machineLine';
export const MACHINE_AND_MACHINELINE_MISMATCHING =
  'MachineLine and machine is mismatching';
export const MACHINE_OR_MACHINELINE_NOT_EXISTS =
  'Machine/MachineLine not exists';
export const MACHINE_DELEATED_SUCCESSFULLY = 'Machine deleted successfully';
export const USER_ALREADY_EXISTS = 'User already exists';
export const FAILED_TO_CREATE_USER = 'Failed to create user';
export const FAILED_TO_CREATE_ADMIN = 'Failed to create admin';
export const FAILED_TO_UPDATE_USER = 'Failed to update user';
export const USER_DELETED_SUCCESSFULLY = 'User deleted successfully';
export const FAILED_TO_DELETE_USER = 'Failed to delete user';
//SHOP
export const SHOP_ALREADY_EXISTS = 'Shop already exists';
export const FAILED_TO_CREATE_SHOP = 'Failed to create shop';
export const THERE_NO_PLANT = 'There no Plant';
export const THERE_IS_NO_SHOP_IN_THIS_PLANT = 'There is no shop in this plant';
export const UNABLE_TO_FETCH_SHOPS = 'unable to fetch shops';
export const THERE_IS_NO_SHOP = 'There is no shop';
export const PLANT_AND_SHOP_IS_MISMATCHING = 'Plant and Shop is mismatching';
export const PLANT_AND_SHOP_NOT_EXISTS = 'Plant/Shop not exists';
export const SHOP_DELETED_SUCCESSFULLY = 'Shop deleted successfully';
//plant
export const PLANT_ALREADY_EXISTS = 'Plant already exists';
export const FAILED_TO_CREATE_PLANT = 'Failed to create plant';
export const THERE_NO_ORGANIZATION = 'There no Organization';
export const THETE_IS_NO_PLANT_IN_THIS_ORGANIZATION =
  'There is no plant in this organization';
export const UNABLE_TO_FETCH_PLANTS = 'unable to fetch plants';
export const THERE_IS_NO_USER_AND_ADMIN = 'There no User/Admin';
export const THERE_IS_NO_PLANT_FOR_THIS_USER =
  'There is no plant for this User';
export const ORGANIZATION_AND_PLANT_IS_MISMATCHING =
  'Organazation and Plant is mismatching';
export const ORGANIZATION_AND_PLANT_NOT_EXISTS =
  'Organization/Plant not exists';
export const PLANT_DELETEd_SUCCESSFULLY = 'Plant deleted successfully';
//organization
export const ORGANIZATION_ALREADY_EXISTS = 'Organization already exists';
export const FAILED_TO_CREATE_ORGANIZATION = 'Failed to create organization';
export const UNABLE_TO_FETCH_ORGANIZATION = 'Unable to fetch organization';
export const ORGANIZATION_NOT_EXISTS = 'Organization not exists';
export const FAILED_TO_UPDATE_ORGANIZATION = 'Failed to update organization';
export const ORGANIZATION_DELETED_SUCCESFULLY =
  'Organization deleted successfully';
export const FAILED_TO_DELETE_ORGANIZATION = 'Failed to delete organization';
//machineline
export const MACHINELINE_ALREADY_EXISTS = 'MachineLine already exists';
export const FAILED_TO_CREATE_MACHINELINE = 'Failed to create machineLine';
export const THERE_IS_NO_MACHINELINE = 'There is no MachineLine';
export const UNABLE_TO_FETCH_MACHINELINES = 'unable to fetch MachineLines';
export const THERE_IS_NO_MACHINELINE_IN_THIS_SHOP =
  'There is no MachineLines in this Shop';
export const SHOP_AND_MACHINELINE_IS_MISMATCHING =
  'Shop and machineLine is mismatching';
export const MACHINELIONE_AND_SHOP_NOT_EXISTS = 'MachineLine/Shop not exists';
export const SHOP_AND_MACHINELINE_NOT_EXISTS = 'Shop/MachineLine not exists';
export const MACHINELINE_DELETED_SUCCESSFULLY =
  'MachineLine deleted successfully';
export const UNABLE_TO_DELETE_PLANT =
  'You have 1 or more shop belongs to this particular plant. So please delete the dependent shops before deleting the plant';
export const UNABLE_TO_DELETE_SHOP =
  'You have 1 or more machine-line belongs to this particular shop. So please delete the dependent machine-line before deleting the shop';
export const UNABLE_TO_DELETE_MACHINELINE =
  'You have 1 or more machine belongs to this particular machine-line. So please delete the dependent machine before deleting the machine-line';
export const UNABLE_TO_DELETE_MACHINE =
  'You have 1 or more element belongs to this particular machine. So please delete the dependent element before deleting the machine';
export const UNABLE_TO_DELETE_ELEMENT =
  'You have 1 or more Sensor belongs to this particular element. So please delete the dependent sensor before deleting the element';
export const UNABLE_TO_DELETE_ORGANIZATION =
  'You have 1 or more plant belongs to this particular organization. So please delete the dependent plant before deleting the organization';
export const NO_PLANT = 'There is no Plant';
export const RECORD_TO_DELETE_DOES_NOT_EXIST = "Record to delete does not exists";
