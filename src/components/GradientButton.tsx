import { Button, ButtonProps } from '@chakra-ui/react';
import { BACKGROUND_GRADIENT } from '../themes/colors';

const GradientButton = (props: ButtonProps) => {
  return (
    <Button
      bgGradient={BACKGROUND_GRADIENT}
      color="white"
      fontWeight="bold"
      _hover={{
        boxShadow: '0 0 1px 2px silver, 0 1px 1px rgba(0, 0, 0, .15)',
      }}
      _focus={{
        opacity: '80%',
      }}
      _active={{
        opacity: '70%',
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default GradientButton;
