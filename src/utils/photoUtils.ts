import { PersonalInfo } from '../types/resume';

export const getPhotoClasses = (personalInfo: PersonalInfo, scaleFactor: number = 1) => {
  const { photoStyle = 'circle', photoSize = 'medium', photoPosition = 'center' } = personalInfo;
  
  // Size calculations
  let sizeClass = '';
  let sizeStyle = {};
  
  switch (photoSize) {
    case 'small':
      sizeStyle = {
        width: `${80 * scaleFactor}px`,
        height: `${80 * scaleFactor}px`
      };
      break;
    case 'medium':
      sizeStyle = {
        width: `${120 * scaleFactor}px`,
        height: `${120 * scaleFactor}px`
      };
      break;
    case 'large':
      sizeStyle = {
        width: `${160 * scaleFactor}px`,
        height: `${160 * scaleFactor}px`
      };
      break;
  }
  
  // Shape calculations
  let shapeClass = '';
  switch (photoStyle) {
    case 'circle':
      shapeClass = 'rounded-full';
      break;
    case 'square':
      shapeClass = 'rounded-none';
      break;
    case 'rounded':
      shapeClass = 'rounded-lg';
      break;
  }
  
  // Position calculations
  let positionClass = '';
  switch (photoPosition) {
    case 'left':
      positionClass = 'self-start';
      break;
    case 'center':
      positionClass = 'self-center mx-auto';
      break;
    case 'right':
      positionClass = 'self-end ml-auto';
      break;
  }
  
  return {
    className: `${shapeClass} ${positionClass} object-cover profile-image`,
    style: sizeStyle
  };
};

export const getPhotoContainerClasses = (personalInfo: PersonalInfo) => {
  const { photoPosition = 'center' } = personalInfo;
  
  switch (photoPosition) {
    case 'left':
      return 'flex justify-start';
    case 'center':
      return 'flex justify-center';
    case 'right':
      return 'flex justify-end';
    default:
      return 'flex justify-center';
  }
}; 