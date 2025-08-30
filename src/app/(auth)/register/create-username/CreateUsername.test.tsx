// // AINDA É NECESSÁRIO REVISAR O CÓDIGO (TypeScript)

// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import CreateUsername from "./page";
// import { AuthContext, authContextType } from "@/contexts/AuthContext";
// import { useRouter } from "next/navigation";

// // 🔹 Mock do useRouter do Next.js
// jest.mock("next/navigation", () => ({
//   useRouter: jest.fn(),
// }));

// describe("CreateUsername component", () => {
//   const mockReplace = jest.fn();
//   const mockPush = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//     (useRouter as jest.Mock).mockReturnValue({
//       replace: mockReplace,
//       push: mockPush,
//     });
//   });

//   it("renderiza o formulário se o usuário não tem username", () => {
//     render(
//       <AuthContext.Provider value={{ ...({} as authContextType), user: null, createUsername: jest.fn() }}>
//         <CreateUsername />
//       </AuthContext.Provider>
//     );

//     // Verifica se o título e input estão no documento
//     expect(screen.getByText("Crie seu nome de usuário")).toBeInTheDocument();
//     expect(
//       screen.getByPlaceholderText("Digite seu nome de usuário")
//     ).toBeInTheDocument();
//   });

//   it("redireciona automaticamente para /home se o usuário já tem username", async () => {
//     render(
//       <AuthContext.Provider
//       //preciso tirar esse type error
//         value={{ user: { username: "joao" }, createUsername: jest.fn() }}
//       >
//         <CreateUsername />
//       </AuthContext.Provider>
//     );

//     await waitFor(() => {
//       expect(mockReplace).toHaveBeenCalledWith("/home");
//     });

//     // Não deve exibir o formulário
//     expect(screen.queryByText("Crie seu nome de usuário")).not.toBeInTheDocument();
//   });

//   it("chama createUsername e faz push para /home ao submeter", async () => {
//     const mockCreateUsername = jest.fn().mockResolvedValue({});
//     render(
//       <AuthContext.Provider value={{ ...({} as authContextType), user: null, createUsername: mockCreateUsername }}>
//         <CreateUsername />
//       </AuthContext.Provider>
//     );

//     // Preenche o input
//     fireEvent.change(screen.getByPlaceholderText("Digite seu nome de usuário"), {
//       target: { value: "novousuario" },
//     });

//     // Clica no botão de submit
//     fireEvent.click(screen.getByRole("button", { name: /cadastrar username/i }));

//     await waitFor(() => {
//       expect(mockCreateUsername).toHaveBeenCalledWith({ username: "novousuario" });
//       expect(mockPush).toHaveBeenCalledWith("/home");
//     });
//   });
// });
