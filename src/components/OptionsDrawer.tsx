import { StarIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Switch,
  Text,
} from '@chakra-ui/react';
import { DarkModeSwitch } from './DarkModeSwitch';

interface OptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchAdings: boolean;
  setSearchAdings: Function;
  lineageId: string;
  changeLineage: Function;
  vertical: boolean;
  setVertical: Function;
  useTransitions: boolean;
  setTransitions: Function;
  collapseNeighbors: boolean;
  setCollapseNeighbors: Function;
  pathFn: string;
  setPathFn: Function;
  siblingSeparation: number;
  setSiblingSeparation: (value: number) => void;
  nonSibSeparation: number;
  setNonSibSeparation: (value: number) => void;
}

/**
 * Drawer in Lineage view to change tree settings
 */
const OptionsDrawer = ({
  isOpen,
  onClose,
  searchAdings,
  setSearchAdings,
  lineageId,
  changeLineage,
  vertical,
  setVertical,
  useTransitions,
  setTransitions,
  collapseNeighbors,
  setCollapseNeighbors,
  pathFn,
  setPathFn,
  siblingSeparation,
  setSiblingSeparation,
  nonSibSeparation,
  setNonSibSeparation,
}: OptionsDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Options</DrawerHeader>

          <DrawerBody>
            {/* Search adings/AKs switch */}
            <Flex mb={3}>
              <Text fontWeight="bold">
                <StarIcon /> Search AKs vs. adings
              </Text>
              <Spacer />
              <Switch
                id="set-search"
                size="lg"
                onChange={() => {
                  setSearchAdings(!searchAdings);
                  changeLineage(lineageId);
                }}
                checked={searchAdings}
                defaultChecked={searchAdings}
              />
            </Flex>

            {/* Vertical/horizontal switch */}
            <Flex mb={3}>
              <Text fontWeight="bold">Vertical/horizontal</Text>
              <Spacer />
              <Switch
                id="set-vertical"
                size="lg"
                onChange={() => setVertical(!vertical)}
                checked={vertical}
                defaultChecked={vertical}
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

            {/* Collapse neighbors switch */}
            <Flex mb={3}>
              <Text fontWeight="bold">Collapse sibs?</Text>
              <Spacer />
              <Switch
                id="set-collapse-sibs"
                size="lg"
                onChange={() => setCollapseNeighbors(!collapseNeighbors)}
                checked={collapseNeighbors}
                defaultChecked={collapseNeighbors}
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
  );
};

export default OptionsDrawer;
