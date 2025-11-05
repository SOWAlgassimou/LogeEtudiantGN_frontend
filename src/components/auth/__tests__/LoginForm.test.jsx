import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from '../LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';

const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  it('renders login form', () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    
    expect(screen.getByText('Connexion à votre compte')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Votre mot de passe')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    
    const submitButton = screen.getByText('Se connecter');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email requis')).toBeInTheDocument();
      expect(screen.getByText('Mot de passe requis')).toBeInTheDocument();
    });
  });
});