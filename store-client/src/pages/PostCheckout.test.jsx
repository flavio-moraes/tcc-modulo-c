import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  useLocation,
  Navigate,
} from "react-router-dom";
import configureMockStore from "redux-mock-store";
import PostCheckout from "./PostCheckout";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  Navigate: jest.fn(),
}));

const mockStore = configureMockStore([]);

describe("PostCheckout page", () => {
  let component;
  let storeState = {
    user: {
      info: {
        id: 100,
        firstname: "John",
        email: "johndeo@email.com",
      },
      isFetching: false,
      error: null,
      errorCode: 0,
    },
    cart: { quantity: 0 },
  };
  let store = mockStore(() => storeState);

  test("renders success message correctly", () => {
    const state = {
      success: true,
      orderNumber: "123456789",
    };

    useLocation.mockImplementation(() => {
      return {
        state: state,
      };
    });

    render(
      <Provider store={store}>
        <Router>
          <PostCheckout state={{ state }} />
        </Router>
      </Provider>
    );

    const successMessage = screen.getByText("Compra realizada com sucesso!");
    const orderNumber = screen.getByText(/123456789/);

    expect(successMessage).toBeInTheDocument();
    expect(orderNumber).toBeInTheDocument();
  });

  test("renders failure message correctly", () => {
    const state = {
      success: false,
    };

    useLocation.mockImplementation(() => {
      return {
        state: state,
      };
    });

    render(
      <Provider store={store}>
        <Router>
          <PostCheckout state={{ state }} />
        </Router>
      </Provider>
    );

    const failureMessage = screen.getByText(
      "Não foi possível concluir a compra."
    );
    expect(failureMessage).toBeInTheDocument();
  });

  test("redirects to home if state is null", async () => {
    useLocation.mockImplementation(() => {
      return { state: null };
    });
    Navigate.mockImplementation(() => {
      return <div>home</div>;
    });

    await act(async () => {
      const { container } = render(
        <Provider store={store}>
          <Router>
            <PostCheckout />
          </Router>
        </Provider>
      );

      expect(container.innerHTML).toBe("<div>home</div>");
    });
  });
});
