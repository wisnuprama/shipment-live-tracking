import math


def distance_between(lat1, lng1, lat2, lng2):
    # distance between latitudes
    # and longitudes
    dLat = ((lat2 - lat1) * math.pi) / 180.0
    dLng = ((lng2 - lng1) * math.pi) / 180.0

    # convert to radians
    lat1r = (lat1 * math.pi) / 180.0
    lat2r = (lat2 * math.pi) / 180.0

    # apply formulae
    a = pow(math.sin(dLat / 2), 2) + \
        pow(math.sin(dLng / 2), 2) * math.cos(lat1r) * math.cos(lat2r)
    rad = 6371
    c = 2 * math.asin(math.sqrt(a))
    return rad * c


def is_in_radius(lat1, lng1, lat2, lng2, radius):
    return distance_between(lat1, lng1, lat2, lng2) <= radius
