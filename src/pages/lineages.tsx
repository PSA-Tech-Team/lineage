import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import Tree from 'react-d3-tree';
import { getLineage, Pairing } from '../fixtures/Pairings';
import SearchModal from '../components/SearchModal';
import OptionsDrawer from '../components/OptionsDrawer';
import { SettingsIcon } from '@chakra-ui/icons';
import { Member } from '../fixtures/Members';
import { getMembers } from '../firebase/member';
import { getPairings } from '../firebase/pairings';

interface LineagesPageProps {
  members: Member[],
  pairings: Pairing[];
}

/**
 * Page to view lineages in a hierarchical view
 */
const LineagesPage = ({ members, pairings }: LineagesPageProps) => {
  // FIXME: for now, setting default lineage to that of first member in list
  const defaultLineageId = members[0].id;
  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [vertical, setVertical] = useState<boolean>(true);
  const [searchAdings, setSearchAdings] = useState<boolean>(true);
  const [lineageId, setLineageId] = useState<string>(defaultLineageId);
  const [pathFn, setPathFn] = useState<string>('diagonal');
  const [useTransitions, setTransitions] = useState<boolean>(true);
  const [siblingSeparation, setSiblingSeparation] = useState<number>(1);
  const [nonSibSeparation, setNonSibSeparation] = useState<number>(1);
  const [collapseNeighbors, setCollapseNeighbors] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const treeParentRef = useRef<HTMLDivElement>(null);

  const changeLineage = (newId: string) => {
    setLineageId(newId);
  }

  useEffect(() => {
    if (treeParentRef.current) {
      const width = treeParentRef.current.offsetWidth;
      const height = treeParentRef.current.offsetHeight;
      setTranslateX(width / 2);
      setTranslateY(height / 4);
    } 
  }, [treeParentRef])

  return (
    <Box>
      <Flex p={4} align="center" borderColor="white">
        <Heading as="h1" fontSize="2xl" fontWeight="light">
          <Link href="/">Lineage</Link>
        </Heading>

        <Spacer />

        {/* Select search direction */}
        <Button
          onClick={() => {
            setSearchAdings(!searchAdings);
            changeLineage(lineageId);
          }}
        >
          {`${searchAdings ? 'Adings' : 'AKs'}`}
        </Button>

        {/* Select lineage */}
        <SearchModal members={members} onSelect={changeLineage} />

        {/* Open options */}
        <Button onClick={onOpen} variant="outline">
          <SettingsIcon />
        </Button>
      </Flex>

      {/* Settings and options */}
      <OptionsDrawer
        isOpen={isOpen}
        onClose={onClose}
        searchAdings={searchAdings}
        setSearchAdings={setSearchAdings}
        lineageId={lineageId}
        changeLineage={changeLineage}
        vertical={vertical}
        setVertical={setVertical}
        useTransitions={useTransitions}
        setTransitions={setTransitions}
        collapseNeighbors={collapseNeighbors}
        setCollapseNeighbors={setCollapseNeighbors}
        pathFn={pathFn}
        setPathFn={setPathFn}
        siblingSeparation={siblingSeparation}
        setSiblingSeparation={setSiblingSeparation}
        nonSibSeparation={nonSibSeparation}
        setNonSibSeparation={setNonSibSeparation}
      />

      {/* Tree view */}
      <Box bgColor="gray.100" height="90vh" ref={treeParentRef}>
        <Tree
          data={getLineage(lineageId, members, pairings, searchAdings)}
          orientation={vertical ? 'vertical' : 'horizontal'}
          // @ts-ignore
          pathFunc={pathFn}
          transitionDuration={400}
          enableLegacyTransitions={useTransitions}
          separation={{
            siblings: siblingSeparation,
            nonSiblings: nonSibSeparation,
          }}
          shouldCollapseNeighborNodes={collapseNeighbors}
          translate={{
            x: translateX,
            y: translateY,
          }}
        />
      </Box>
    </Box>
  );
};

export async function getStaticProps() {
  const members: Member[] = await getMembers();
  const pairings: Pairing[] = await getPairings();

  return {
    props: {
      members,
      pairings,
    },
  };
}

export default LineagesPage;
