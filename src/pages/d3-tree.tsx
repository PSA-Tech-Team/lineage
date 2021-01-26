import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Heading,
  Spacer,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Tree from 'react-d3-tree';
import { NEIL_LINEAGE } from '../fixtures/Neil';

const D3Tree = () => {
  const [vertical, setVertical] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex p={5} align="center" borderColor="white">
        <Text fontFamily="monospace">PSA UIUC</Text>
        <Spacer />
        <Heading as="h1" fontWeight="light">
          Lineage
        </Heading>
        <Spacer />
        <Button onClick={onOpen}>Options</Button>
      </Flex>

      {/* Settings and options */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Options</DrawerHeader>

            <DrawerBody>
              <Flex>
                <Text>Vertical/horizontal</Text>
                <Spacer />
                <Switch
                  id="set-vertical"
                  size="lg"
                  onChange={() => setVertical(!vertical)}
                />
              </Flex>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {/* Tree view */}
      <Box bgColor="gray.100" height="85vh">
        <Tree
          data={NEIL_LINEAGE}
          orientation={vertical ? 'vertical' : 'horizontal'}
          pathFunc="diagonal"
          transitionDuration={400}
          enableLegacyTransitions={true}
          separation={{
            siblings: 2,
            nonSiblings: 3,
          }}
        />
      </Box>
    </Box>
  );
};

export default D3Tree;
