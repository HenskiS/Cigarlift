import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const reportsAdapter = createEntityAdapter({})

const initialState = reportsAdapter.getInitialState()

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReports: builder.query({
            query: () => ({
                url: '/reports',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedReports = responseData.map(report => {
                    report.id = report._id
                    return report
                });
                return reportsAdapter.setAll(initialState, loadedReports)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Report', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Report', id }))
                    ]
                } else return [{ type: 'Report', id: 'LIST' }]
            }
        }),
        getReportById: builder.query({
            query: (id) => ({
                url: `/reports/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: ['Report']
        }),
        addNewReport: builder.mutation({
            query: initialReportData => ({
                url: '/reports',
                method: 'POST',
                body: {
                    ...initialReportData,
                }
            }),
            invalidatesTags: [
                { type: 'Report', id: "LIST" }
            ]
        }),
        updateReport: builder.mutation({
            query: initialReportData => ({
                url: '/reports',
                method: 'PATCH',
                body: {
                    ...initialReportData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Report', id: arg.id }
            ]
        }),
        deleteReport: builder.mutation({
            query: ({ id }) => ({
                url: `/reports`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Report', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetReportsQuery,
    useGetReportByIdQuery,
    useAddNewReportMutation,
    useUpdateReportMutation,
    useDeleteReportMutation,
} = reportsApiSlice

// returns the query result object
export const selectReportsResult = reportsApiSlice.endpoints.getReports.select()

// creates memoized selector
const selectReportsData = createSelector(
    selectReportsResult,
    reportsResult => reportsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllReports,
    selectById: selectReportById,
    selectIds: selectReportIds
    // Pass in a selector that returns the reports slice of state
} = reportsAdapter.getSelectors(state => selectReportsData(state) ?? initialState)