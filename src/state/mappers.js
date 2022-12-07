import { getState } from './store'

/**
 *
 * @returns {typeof import('../framework-mappers/framework-mapper-base').FrameworkMapperBase}
 */
export const getSelectedMapper = () => getState().selectedMapper
