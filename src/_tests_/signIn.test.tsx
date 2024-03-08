import { fireEvent, render, screen } from '@testing-library/react';
import SignIn from '../pages/login/index';
import { BrowserRouter } from 'react-router-dom';

describe('SignIn component', () => {
  test('renders the sign in page', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    // Assert that the page title is rendered
    expect(screen.getByText('Sign in')).toBeTruthy();



    // Assert that the "Sign In" button is rendered
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
  });
  test('toggles "Remember me" checkbox', () => {
    // Render the SignIn component
    const { getByLabelText } = render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    // Get the "Remember me" checkbox
    const rememberMeCheckbox = getByLabelText('Remember me') as HTMLInputElement;

    // Initially, the checkbox should be unchecked
    expect(rememberMeCheckbox.checked).toBeFalsy();

    // Simulate clicking on the checkbox
    fireEvent.click(rememberMeCheckbox);

    // After clicking, the checkbox should be checked
    expect(rememberMeCheckbox.checked).toBeTruthy();
});

});
