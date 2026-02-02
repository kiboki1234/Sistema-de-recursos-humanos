import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock scrollIntoView because JSDOM doesn't support it (used in Footer sometimes)
window.HTMLElement.prototype.scrollIntoView = function () { };

test('renders Home Page welcome message', () => {
    render(
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );

    const welcomeElement = screen.getByText(/Bienvenido al Club de Política Exterior/i);
    expect(welcomeElement).toBeInTheDocument();

    const eventElement = screen.getByText(/SICMUN V/i);
    expect(eventElement).toBeInTheDocument();
});
