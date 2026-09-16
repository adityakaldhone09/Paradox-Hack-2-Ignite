import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActivityEvent, AuditVerification, AuditVerifyInput, BlockchainSummary, BlockchainTransaction, Centre, CustodyEvent, DashboardSummary, Examination, ExaminationInput, HealthStatus, Incident, IncidentInput, ListExaminationsParams, ListIncidentsParams, ListPapersParams, NotFoundResponse, Paper, PaperInput, VerificationInput, VerificationResult } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Get command center summary
 */
export declare const getDashboardSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get command center summary
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardActivityUrl: () => string;
/**
 * @summary Get recent security activity
 */
export declare const getDashboardActivity: (options?: Parameters<typeof customFetch>[1]) => Promise<ActivityEvent[]>;
export declare const getGetDashboardActivityQueryKey: () => readonly ["/api/dashboard/activity"];
export declare const getGetDashboardActivityQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardActivity>>>;
export type GetDashboardActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent security activity
 */
export declare function useGetDashboardActivity<TData = Awaited<ReturnType<typeof getDashboardActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListExaminationsUrl: (params?: ListExaminationsParams) => string;
/**
 * @summary List examinations
 */
export declare const listExaminations: (params?: ListExaminationsParams, options?: Parameters<typeof customFetch>[1]) => Promise<Examination[]>;
export declare const getListExaminationsQueryKey: (params?: ListExaminationsParams) => readonly ["/api/examinations", ...ListExaminationsParams[]];
export declare const getListExaminationsQueryOptions: <TData = Awaited<ReturnType<typeof listExaminations>>, TError = ErrorType<unknown>>(params?: ListExaminationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listExaminations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listExaminations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListExaminationsQueryResult = NonNullable<Awaited<ReturnType<typeof listExaminations>>>;
export type ListExaminationsQueryError = ErrorType<unknown>;
/**
 * @summary List examinations
 */
export declare function useListExaminations<TData = Awaited<ReturnType<typeof listExaminations>>, TError = ErrorType<unknown>>(params?: ListExaminationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listExaminations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateExaminationUrl: () => string;
/**
 * @summary Create an examination
 */
export declare const createExamination: (examinationInput: ExaminationInput, options?: Parameters<typeof customFetch>[1]) => Promise<Examination>;
export declare const getCreateExaminationMutationKey: () => readonly ["createExamination"];
export declare const getCreateExaminationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createExamination>>, TError, CreateExaminationMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createExamination>>, TError, CreateExaminationMutationVariables, TContext>;
export type CreateExaminationMutationResult = NonNullable<Awaited<ReturnType<typeof createExamination>>>;
export type CreateExaminationMutationBody = BodyType<ExaminationInput>;
export type CreateExaminationMutationError = ErrorType<unknown>;
export type CreateExaminationMutationVariables = {
    data: BodyType<ExaminationInput>;
};
/**
* @summary Create an examination
*/
export declare const useCreateExamination: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createExamination>>, TError, CreateExaminationMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createExamination>>, TError, CreateExaminationMutationVariables, TContext>;
export declare const getGetExaminationUrl: (id: string) => string;
/**
 * @summary Get an examination
 */
export declare const getExamination: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<Examination>;
export declare const getGetExaminationQueryKey: (id: string) => readonly [`/api/examinations/${string}`];
export declare const getGetExaminationQueryOptions: <TData = Awaited<ReturnType<typeof getExamination>>, TError = ErrorType<NotFoundResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getExamination>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getExamination>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetExaminationQueryResult = NonNullable<Awaited<ReturnType<typeof getExamination>>>;
export type GetExaminationQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get an examination
 */
export declare function useGetExamination<TData = Awaited<ReturnType<typeof getExamination>>, TError = ErrorType<NotFoundResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getExamination>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPapersUrl: (params?: ListPapersParams) => string;
/**
 * @summary List secured examination papers
 */
export declare const listPapers: (params?: ListPapersParams, options?: Parameters<typeof customFetch>[1]) => Promise<Paper[]>;
export declare const getListPapersQueryKey: (params?: ListPapersParams) => readonly ["/api/papers", ...ListPapersParams[]];
export declare const getListPapersQueryOptions: <TData = Awaited<ReturnType<typeof listPapers>>, TError = ErrorType<unknown>>(params?: ListPapersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPapers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPapers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPapersQueryResult = NonNullable<Awaited<ReturnType<typeof listPapers>>>;
export type ListPapersQueryError = ErrorType<unknown>;
/**
 * @summary List secured examination papers
 */
export declare function useListPapers<TData = Awaited<ReturnType<typeof listPapers>>, TError = ErrorType<unknown>>(params?: ListPapersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPapers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePaperUrl: () => string;
/**
 * @summary Register a paper
 */
export declare const createPaper: (paperInput: PaperInput, options?: Parameters<typeof customFetch>[1]) => Promise<Paper>;
export declare const getCreatePaperMutationKey: () => readonly ["createPaper"];
export declare const getCreatePaperMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPaper>>, TError, CreatePaperMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPaper>>, TError, CreatePaperMutationVariables, TContext>;
export type CreatePaperMutationResult = NonNullable<Awaited<ReturnType<typeof createPaper>>>;
export type CreatePaperMutationBody = BodyType<PaperInput>;
export type CreatePaperMutationError = ErrorType<unknown>;
export type CreatePaperMutationVariables = {
    data: BodyType<PaperInput>;
};
/**
* @summary Register a paper
*/
export declare const useCreatePaper: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPaper>>, TError, CreatePaperMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPaper>>, TError, CreatePaperMutationVariables, TContext>;
export declare const getGetPaperUrl: (id: string) => string;
/**
 * @summary Get paper details
 */
export declare const getPaper: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<Paper>;
export declare const getGetPaperQueryKey: (id: string) => readonly [`/api/papers/${string}`];
export declare const getGetPaperQueryOptions: <TData = Awaited<ReturnType<typeof getPaper>>, TError = ErrorType<NotFoundResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPaper>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPaper>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPaperQueryResult = NonNullable<Awaited<ReturnType<typeof getPaper>>>;
export type GetPaperQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get paper details
 */
export declare function useGetPaper<TData = Awaited<ReturnType<typeof getPaper>>, TError = ErrorType<NotFoundResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPaper>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getVerifyPaperUrl: (id: string) => string;
/**
 * @summary Verify paper integrity
 */
export declare const verifyPaper: (id: string, verificationInput?: VerificationInput, options?: Parameters<typeof customFetch>[1]) => Promise<VerificationResult>;
export declare const getVerifyPaperMutationKey: () => readonly ["verifyPaper"];
export declare const getVerifyPaperMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyPaper>>, TError, VerifyPaperMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyPaper>>, TError, VerifyPaperMutationVariables, TContext>;
export type VerifyPaperMutationResult = NonNullable<Awaited<ReturnType<typeof verifyPaper>>>;
export type VerifyPaperMutationBody = BodyType<VerificationInput> | undefined;
export type VerifyPaperMutationError = ErrorType<unknown>;
export type VerifyPaperMutationVariables = {
    id: string;
    data?: BodyType<VerificationInput>;
};
/**
* @summary Verify paper integrity
*/
export declare const useVerifyPaper: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyPaper>>, TError, VerifyPaperMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyPaper>>, TError, VerifyPaperMutationVariables, TContext>;
export declare const getGetPaperEventsUrl: (id: string) => string;
/**
 * @summary Get chain of custody events
 */
export declare const getPaperEvents: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<CustodyEvent[]>;
export declare const getGetPaperEventsQueryKey: (id: string) => readonly [`/api/papers/${string}/events`];
export declare const getGetPaperEventsQueryOptions: <TData = Awaited<ReturnType<typeof getPaperEvents>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPaperEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPaperEvents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPaperEventsQueryResult = NonNullable<Awaited<ReturnType<typeof getPaperEvents>>>;
export type GetPaperEventsQueryError = ErrorType<unknown>;
/**
 * @summary Get chain of custody events
 */
export declare function useGetPaperEvents<TData = Awaited<ReturnType<typeof getPaperEvents>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPaperEvents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListCentresUrl: () => string;
/**
 * @summary List examination centres
 */
export declare const listCentres: (options?: Parameters<typeof customFetch>[1]) => Promise<Centre[]>;
export declare const getListCentresQueryKey: () => readonly ["/api/centres"];
export declare const getListCentresQueryOptions: <TData = Awaited<ReturnType<typeof listCentres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCentres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCentres>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCentresQueryResult = NonNullable<Awaited<ReturnType<typeof listCentres>>>;
export type ListCentresQueryError = ErrorType<unknown>;
/**
 * @summary List examination centres
 */
export declare function useListCentres<TData = Awaited<ReturnType<typeof listCentres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCentres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCentreUrl: (id: string) => string;
/**
 * @summary Get centre details
 */
export declare const getCentre: (id: string, options?: Parameters<typeof customFetch>[1]) => Promise<Centre>;
export declare const getGetCentreQueryKey: (id: string) => readonly [`/api/centres/${string}`];
export declare const getGetCentreQueryOptions: <TData = Awaited<ReturnType<typeof getCentre>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCentre>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCentre>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCentreQueryResult = NonNullable<Awaited<ReturnType<typeof getCentre>>>;
export type GetCentreQueryError = ErrorType<unknown>;
/**
 * @summary Get centre details
 */
export declare function useGetCentre<TData = Awaited<ReturnType<typeof getCentre>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCentre>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListIncidentsUrl: (params?: ListIncidentsParams) => string;
/**
 * @summary List security incidents
 */
export declare const listIncidents: (params?: ListIncidentsParams, options?: Parameters<typeof customFetch>[1]) => Promise<Incident[]>;
export declare const getListIncidentsQueryKey: (params?: ListIncidentsParams) => readonly ["/api/incidents", ...ListIncidentsParams[]];
export declare const getListIncidentsQueryOptions: <TData = Awaited<ReturnType<typeof listIncidents>>, TError = ErrorType<unknown>>(params?: ListIncidentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listIncidents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listIncidents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListIncidentsQueryResult = NonNullable<Awaited<ReturnType<typeof listIncidents>>>;
export type ListIncidentsQueryError = ErrorType<unknown>;
/**
 * @summary List security incidents
 */
export declare function useListIncidents<TData = Awaited<ReturnType<typeof listIncidents>>, TError = ErrorType<unknown>>(params?: ListIncidentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listIncidents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateIncidentUrl: () => string;
/**
 * @summary Create a security incident
 */
export declare const createIncident: (incidentInput: IncidentInput, options?: Parameters<typeof customFetch>[1]) => Promise<Incident>;
export declare const getCreateIncidentMutationKey: () => readonly ["createIncident"];
export declare const getCreateIncidentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createIncident>>, TError, CreateIncidentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createIncident>>, TError, CreateIncidentMutationVariables, TContext>;
export type CreateIncidentMutationResult = NonNullable<Awaited<ReturnType<typeof createIncident>>>;
export type CreateIncidentMutationBody = BodyType<IncidentInput>;
export type CreateIncidentMutationError = ErrorType<unknown>;
export type CreateIncidentMutationVariables = {
    data: BodyType<IncidentInput>;
};
/**
* @summary Create a security incident
*/
export declare const useCreateIncident: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createIncident>>, TError, CreateIncidentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createIncident>>, TError, CreateIncidentMutationVariables, TContext>;
export declare const getGetBlockchainSummaryUrl: () => string;
/**
 * @summary Get blockchain network health
 */
export declare const getBlockchainSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<BlockchainSummary>;
export declare const getGetBlockchainSummaryQueryKey: () => readonly ["/api/blockchain/summary"];
export declare const getGetBlockchainSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getBlockchainSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBlockchainSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBlockchainSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBlockchainSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getBlockchainSummary>>>;
export type GetBlockchainSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get blockchain network health
 */
export declare function useGetBlockchainSummary<TData = Awaited<ReturnType<typeof getBlockchainSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBlockchainSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListBlockchainTransactionsUrl: () => string;
/**
 * @summary List blockchain transactions
 */
export declare const listBlockchainTransactions: (options?: Parameters<typeof customFetch>[1]) => Promise<BlockchainTransaction[]>;
export declare const getListBlockchainTransactionsQueryKey: () => readonly ["/api/blockchain/transactions"];
export declare const getListBlockchainTransactionsQueryOptions: <TData = Awaited<ReturnType<typeof listBlockchainTransactions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlockchainTransactions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBlockchainTransactions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBlockchainTransactionsQueryResult = NonNullable<Awaited<ReturnType<typeof listBlockchainTransactions>>>;
export type ListBlockchainTransactionsQueryError = ErrorType<unknown>;
/**
 * @summary List blockchain transactions
 */
export declare function useListBlockchainTransactions<TData = Awaited<ReturnType<typeof listBlockchainTransactions>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlockchainTransactions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAuditVerifyUrl: () => string;
/**
 * @summary Verify an item for an auditor
 */
export declare const auditVerify: (auditVerifyInput: AuditVerifyInput, options?: Parameters<typeof customFetch>[1]) => Promise<AuditVerification>;
export declare const getAuditVerifyMutationKey: () => readonly ["auditVerify"];
export declare const getAuditVerifyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof auditVerify>>, TError, AuditVerifyMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof auditVerify>>, TError, AuditVerifyMutationVariables, TContext>;
export type AuditVerifyMutationResult = NonNullable<Awaited<ReturnType<typeof auditVerify>>>;
export type AuditVerifyMutationBody = BodyType<AuditVerifyInput>;
export type AuditVerifyMutationError = ErrorType<unknown>;
export type AuditVerifyMutationVariables = {
    data: BodyType<AuditVerifyInput>;
};
/**
* @summary Verify an item for an auditor
*/
export declare const useAuditVerify: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof auditVerify>>, TError, AuditVerifyMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof auditVerify>>, TError, AuditVerifyMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map