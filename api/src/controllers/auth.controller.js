import asyncHandler from "express-async-handler"
import { TokenService } from "../utils/Jwt.js"
import { authService } from "../services/auth.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { logger } from "../utils/logger.js"

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { user, accessToken, refreshToken } = await authService.register(req.body)
        TokenService.setTokens(res, { accessToken, refreshToken });

        logger.debug(`user: =>  ${JSON.stringify(user)}`)
        return ApiResponse.success(res, {
            statusCode: 201,
            message: "User Created Succesfully",
            data: user
        })
    })

    login = asyncHandler(async (req, res) => {
        const { user, accessToken, refreshToken } = await authService.login(req.body)
        TokenService.setTokens(res, { accessToken, refreshToken })
        return ApiResponse.success(res, {
            message: "User login Succesfully",
            data: user
        })
    })

    logout = asyncHandler(async (req, res) => {
        const isClear = await authService.logout(req.user.id)
        if (isClear) {
            TokenService.clearTokens(res)
            return ApiResponse.success(res, {
                message: "Logged out successfully"
            })
        }
    })

    getCurrentUser = asyncHandler(async (req, res) => {
        return ApiResponse.success(res, {
            message: "Current user fetched successfully",
            data: req.user,
        })
    })

    refreshTokens = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        const { user, accessToken, refreshToken: newRefresh } = await authService.refresh(refreshToken)
        TokenService.setTokens(res, { accessToken, refreshToken: newRefresh })
        return ApiResponse.success(res, {
            message: "Tokens refreshed",
            data: user,
        })
    })

    updateUserData = asyncHandler(async (req, res) => {
        const { user } = await authService.updateUser(req.body, req.user)
        return ApiResponse.success(res, {
            message: "User updated Succesfully",
            data: user
        })
    })
}

export const auth = new AuthController();