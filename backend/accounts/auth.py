from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class IdTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    기본은 username/password를 받지만,
    프론트 폼에 맞춰 'id' 필드도 허용한다.
    """
    def validate(self, attrs):
        # 'id'로 들어오면 username으로 치환
        if "id" in attrs and "username" not in attrs:
            attrs["username"] = attrs["id"]
        return super().validate(attrs)
