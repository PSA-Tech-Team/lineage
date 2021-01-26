import { Box } from '@chakra-ui/react';
import Tree from 'react-d3-tree';
import { Switch } from '@chakra-ui/react';
import { NEIL_LINEAGE } from '../fixtures/Neil';
import { useState } from 'react';

const D3Tree = () => {
  const [vertical, setVertical] = useState<boolean>(true);

  return (
    <Box w="100%" h="100vh" bgColor="gray.300">
      <Switch
        id="set-vertical"
        position="fixed"
        size="lg"
        onChange={() => setVertical(!vertical)}
      />
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
  );
};

export default D3Tree;
