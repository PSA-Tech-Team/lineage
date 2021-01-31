import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRef } from 'react';
import * as yup from 'yup';
import { addMember } from '../firebase/member';
import { Member } from '../fixtures/Members';

const memberSchema = yup.object().shape({
  name: yup.string().required(),
  classOf: yup.string().length(4).matches(RegExp('^[0-9]*$')).required(),
  hasAdings: yup.boolean().required(),
  hasAks: yup.boolean().required(),
});

const MemberForm = ({ refresh }: { refresh: () => Promise<Member[]> }) => {
  const nameInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  return (
    <Formik
      initialValues={{
        name: '',
        classOf: '',
        hasAdings: false,
        hasAks: false,
      }}
      validationSchema={memberSchema}
      onSubmit={async (values, actions) => {
        // Add member to database
        await addMember(values);

        // Notify user through toast
        toast({
          title: 'Success!',
          description: `${values.name} has been added.`,
          status: 'success',
        });

        // Update UI
        actions.setSubmitting(false);
        actions.resetForm();
        refresh();
        nameInput.current?.focus();
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

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;
