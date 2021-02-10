import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import * as yup from 'yup';
import { Member } from '../fixtures/Members';

const memberSchema = yup.object().shape({
  name: yup.string().required(),
  classOf: yup.string().length(4).matches(RegExp('^[0-9]*$')).required(),
  adings: yup.number().required(),
  aks: yup.number().required(),
});

/**
 * Form to add members to database
 */
const MemberForm = ({ refresh }: { refresh: () => Promise<Member[]> }) => {
  const [keepClass, setKeepClass] = useState<boolean>(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  return (
    <Formik
      initialValues={{
        name: '',
        classOf: '',
        adings: 0,
        aks: 0,
      }}
      validationSchema={memberSchema}
      onSubmit={async (values, actions) => {
        // Add member to database
        await fetch(`/api/members`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        // Notify user through toast
        toast({
          title: 'Success!',
          description: `${values.name} has been added.`,
          status: 'success',
        });

        // Update UI
        actions.setSubmitting(false);
        actions.resetForm();

        // Reset class only if specified
        if (keepClass) actions.setFieldValue('classOf', values.classOf);

        nameInput.current?.focus();
        await refresh();
      }}
    >
      {({
        handleChange,
        handleReset,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
        <Form>
          {/* Name */}
          <FormControl
            id="name"
            isRequired
            isInvalid={Boolean(errors.name && touched.name)}
          >
            <FormLabel>Name</FormLabel>
            <Input
              id="name"
              placeholder="Ex: Renzo"
              value={values.name}
              onChange={handleChange}
              onReset={handleReset}
              ref={nameInput}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          {/* Class */}
          <FormControl
            id="classOf"
            isRequired
            isInvalid={Boolean(errors.classOf && touched.classOf)}
            mt={2}
          >
            <FormLabel>Class of</FormLabel>
            <Input
              id="classOf"
              placeholder="Ex: 2023"
              value={values.classOf}
              onChange={handleChange}
              onReset={handleReset}
            />
            <FormErrorMessage>{errors.classOf}</FormErrorMessage>
          </FormControl>

          <Checkbox my={2} onChange={() => setKeepClass(!keepClass)}>
            Keep class after submission
          </Checkbox>

          <Flex>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;
