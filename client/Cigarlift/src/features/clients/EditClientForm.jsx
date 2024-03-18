import { useState, useEffect } from "react"
import { useUpdateClientMutation, useDeleteClientMutation } from "./clientsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const CLIENT_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditClientForm = ({ client }) => {

    const [updateClient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateClientMutation()

    const [deleteClient, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteClientMutation()

    const navigate = useNavigate()

    const [clientname, setClientname] = useState(client.clientname)
    const [validClientname, setValidClientname] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(client.roles)
    const [active, setActive] = useState(client.active)

    useEffect(() => {
        setValidClientname(CLIENT_REGEX.test(clientname))
    }, [clientname])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setClientname('')
            setPassword('')
            setRoles([])
            navigate('/dash')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onClientnameChanged = e => setClientname(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveClientClicked = async (e) => {
        if (password) {
            await updateClient({ id: client.id, clientname, password, roles, active })
        } else {
            await updateClient({ id: client.id, clientname, roles, active })
        }
    }

    const onDeleteClientClicked = async () => {
        await deleteClient({ id: client.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    let canSave
    if (password) {
        canSave = [roles.length, validClientname, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validClientname].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validClientClass = !validClientname ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Client</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveClientClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteClientClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="clientname">
                    Clientname: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validClientClass}`}
                    id="clientname"
                    name="clientname"
                    type="text"
                    autoComplete="off"
                    value={clientname}
                    onChange={onClientnameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="client-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="client-active"
                        name="client-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}
export default EditClientForm
