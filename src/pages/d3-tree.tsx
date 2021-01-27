import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Tree from 'react-d3-tree';
import { CHARLES_LINEAGE } from '../fixtures/Charles';
import { NEIL_LINEAGE } from '../fixtures/Neil';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { RawNodeDatum, getLineage } from '../fixtures/Pairings';
import { PSA_MEMBERS_WITH_IDS } from '../fixtures/Members';

const D3Tree = () => {
  const lineages = [NEIL_LINEAGE, CHARLES_LINEAGE];
  const [vertical, setVertical] = useState<boolean>(true);
  const [searchAdings, setSearchAdings] = useState<boolean>(true);
  const [lineage, setLineage] = useState<RawNodeDatum>(
    getLineage(20, searchAdings)
  );
  const [pathFn, setPathFn] = useState<string>('diagonal');
  const [useTransitions, setTransitions] = useState<boolean>(true);
  const [siblingSeparation, setSiblingSeparation] = useState<number>(2);
  const [nonSibSeparation, setNonSibSeparation] = useState<number>(2);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex p={4} align="center" borderColor="white">
        <Heading as="h1" fontSize="2xl" fontWeight="light">
          <Link href="/">Lineage</Link>
        </Heading>

        <Spacer />

        {/* Select lineage */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            onClick={() => console.log(lineage)}
            mr={2}
          >
            {`${lineage.name}'s Lineage`}
          </MenuButton>
          <MenuList>
            {PSA_MEMBERS_WITH_IDS.map((member, i) => (
              <MenuItem
                key={i}
                onClick={() => setLineage(getLineage(i, searchAdings))}
              >
                {member.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Open options */}
        <Button onClick={onOpen} variant="outline">
          Options
        </Button>
      </Flex>

      {/* Settings and options */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Options</DrawerHeader>

            <DrawerBody>
              {/* Vertical/horizontal switch */}
              <Flex mb={3}>
                <Text fontWeight="bold">Vertical/horizontal</Text>
                <Spacer />
                <Switch
                  id="set-vertical"
                  size="lg"
                  onChange={() => setVertical(!vertical)}
                />
              </Flex>

              {/* Transitions switch */}
              <Flex mb={3}>
                <Text fontWeight="bold">Use transitions?</Text>
                <Spacer />
                <Switch
                  id="set-transitions"
                  size="lg"
                  onChange={() => setTransitions(!useTransitions)}
                  checked={useTransitions}
                  defaultChecked={useTransitions}
                />
              </Flex>

              {/* Path function type */}
              <Text fontWeight="bold" my={2}>
                Link type
              </Text>
              {['Diagonal', 'Straight', 'Step'].map((fn) => (
                <Button
                  key={fn}
                  onClick={() => setPathFn(fn.toLowerCase())}
                  isFullWidth
                  m={1}
                  variant={pathFn === fn.toLowerCase() ? 'solid' : 'outline'}
                >
                  {fn}
                </Button>
              ))}

              {/* Sibling Separation */}
              <Text fontWeight="bold" mt={5}>
                Sibling Separation
              </Text>
              <Slider
                name="siblings"
                defaultValue={siblingSeparation}
                min={1}
                max={4}
                onChange={setSiblingSeparation}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>

              {/* Non-sibling Separation */}
              <Text fontWeight="bold">Non-sibling Separation</Text>
              <Slider
                name="siblings"
                defaultValue={nonSibSeparation}
                min={1}
                max={4}
                onChange={setNonSibSeparation}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>

              {/* Dark mode */}
              <Text fontWeight="bold" mt={5}>
                Use dark mode?
              </Text>
              <DarkModeSwitch fixed={false} />
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
      <Box bgColor="gray.100" height="90vh">
        <Tree
          data={lineage}
          orientation={vertical ? 'vertical' : 'horizontal'}
          // @ts-ignore
          pathFunc={pathFn}
          transitionDuration={400}
          enableLegacyTransitions={useTransitions}
          separation={{
            siblings: siblingSeparation,
            nonSiblings: nonSibSeparation,
          }}
        />
      </Box>
    </Box>
  );
};

export default D3Tree;
