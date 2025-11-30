import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard, DynamicForm, SubmissionsTable } from './pages';
import FormBuilder from './pages/FormBuilder';


// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Dashboard />} />
          {/* <Route path="/forms/:id" element={<DynamicForm />} /> */}

          <Route path="/forms/:id" element={<DynamicForm />}></Route>
          <Route path="/forms" element={<FormBuilder />}></Route>

          <Route path="/submissions/:id" element={<SubmissionsTable />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

// <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex space-x-8">
//               <button
//                 onClick={() => setCurrentPage('form')}
//                 className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition ${currentPage === 'form'
//                     ? 'border-blue-500 text-gray-900'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 Form
//               </button>
//               <button
//                 onClick={() => setCurrentPage('submissions')}
//                 className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition ${currentPage === 'submissions'
//                     ? 'border-blue-500 text-gray-900'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 Submissions
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {currentPage === 'form' ? (
//           <DynamicForm onSuccess={() => setCurrentPage('submissions')} />
//         ) : (
//           <SubmissionsTable />
//         )}
//       </main>
//     </div>