// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vibration_cubit.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VibrationState _$VibrationStateFromJson(Map<String, dynamic> json) =>
    VibrationState(
      onNewNoun: json['onNewNoun'] as bool? ?? false,
      onVote: json['onVote'] as bool? ?? false,
    );

Map<String, dynamic> _$VibrationStateToJson(VibrationState instance) =>
    <String, dynamic>{
      'onNewNoun': instance.onNewNoun,
      'onVote': instance.onVote,
    };
