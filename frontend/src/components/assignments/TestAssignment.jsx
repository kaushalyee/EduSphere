import React from 'react';
import AssignmentSubmissionWithRubric from './AssignmentSubmissionWithRubric';

const TestAssignment = () => {
  const mockAssignment = {
    _id: 'test-assignment-123',
    title: 'Test Assignment for Demo',
    description: 'This is a test assignment to demonstrate the upload functionality'
  };

  const handleSubmissionComplete = (result) => {
    console.log('Submission completed:', result);
    alert('Submission completed successfully!');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Test Assignment Upload</h1>
      <AssignmentSubmissionWithRubric 
        assignment={mockAssignment}
        onSubmissionComplete={handleSubmissionComplete}
      />
    </div>
  );
};

export default TestAssignment;
