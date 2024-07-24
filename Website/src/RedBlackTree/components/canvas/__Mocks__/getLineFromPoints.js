
import { afterEach, describe, expect, it, vi } from 'vitest'

export default vi.fn().mockImplementation((toPoint, fromPoint) => {
    return null;
})