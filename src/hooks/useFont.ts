import { useResume } from '../context/ResumeContext';
import { DEFAULT_FONT, getFallbackStack } from '../utils/fonts';

export const useFont = () => {
  const { state } = useResume();
  const selectedFont = state.resumeData.decoratorSettings?.selectedFont || DEFAULT_FONT;

  const getFontStyle = (weight: string = '400') => ({
    fontFamily: `'${selectedFont}', ${getFallbackStack(selectedFont)}`,
    fontWeight: weight
  });

  const getFontClass = (weight: string = '400') => {
    return {
      fontFamily: `'${selectedFont}', ${getFallbackStack(selectedFont)}`,
      fontWeight: weight
    };
  };

  return {
    selectedFont,
    getFontStyle,
    getFontClass
  };
}; 